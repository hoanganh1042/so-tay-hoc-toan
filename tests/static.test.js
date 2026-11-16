// Kiểm thử tĩnh về bảo mật và đóng gói: chính sách CSP, không có mã nội tuyến, danh sách tệp lưu ngoại tuyến đầy đủ,
// và không có bí mật hay đường dẫn máy cá nhân lọt vào kho mã.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT, WEB, APP_HTML, read, html, scripts } = require('./helpers.js');

const page = html();
const webJs = fs.readdirSync(WEB).filter(f => f.endsWith('.js'));

test('trang có CSP chặt: chỉ chạy mã từ chính trang, không unsafe-inline, không unsafe-eval', () => {
  const m = page.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/);
  assert.ok(m, 'thiếu thẻ CSP');
  const d = Object.fromEntries(m[1].split(';').map(s => s.trim().split(/\s+/)).map(([k, ...v]) => [k, v.join(' ')]));
  assert.equal(d['default-src'], "'self'");
  assert.equal(d['script-src'], "'self'");
  assert.equal(d['object-src'], "'none'");
  assert.equal(d['base-uri'], "'none'");
  assert.equal(d['connect-src'], "'self'");
  assert.doesNotMatch(d['style-src'], /unsafe-inline/);
  assert.doesNotMatch(m[1], /unsafe-eval/);
});

test('CSP trong netlify.toml trùng với thẻ meta (cộng frame-ancestors)', () => {
  const meta = page.match(/Content-Security-Policy" content="([^"]+)"/)[1];
  const toml = read(ROOT, 'netlify.toml').match(/Content-Security-Policy = "([^"]+)"/)[1];
  assert.equal(toml, meta + "; frame-ancestors 'none'");
});

test('trang không có mã nội tuyến hay trình xử lý sự kiện nội tuyến', () => {
  assert.doesNotMatch(page, /<script(?![^>]*\ssrc=)[^>]*>/i, 'có thẻ <script> nội tuyến');
  assert.doesNotMatch(page, /<style/i, 'có thẻ <style> nội tuyến');
  assert.doesNotMatch(page, /\son[a-z]+\s*=\s*["']/i, 'có thuộc tính on...= trong trang');
  assert.doesNotMatch(page, /javascript:/i);
});

test('mã giao diện không dùng eval, new Function, document.write hay trình xử lý nội tuyến trong chuỗi HTML', () => {
  for (const f of ['app.js', 'db.js', 'boot.js', 'view_congthuc.js', 'sw.js']) {
    const s = read(WEB, f);
    assert.doesNotMatch(s, /\beval\s*\(|new Function\s*\(|document\.write\s*\(/, f);
    assert.doesNotMatch(s, /<[a-z][^>]*\son(click|change|input|load|error|submit|mouseover|focus)\s*=/i, f + ': có trình xử lý sự kiện nội tuyến trong chuỗi HTML');
    assert.doesNotMatch(s, /javascript:/i, f);
  }
});

test('mọi tệp trang nạp đều tồn tại và nằm trong danh sách lưu ngoại tuyến của service worker', () => {
  const sw = read(WEB, 'sw.js');
  const shell = [...sw.match(/const SHELL = \[([\s\S]*?)\];/)[1].matchAll(/'\.\/([^']*)'/g)].map(m => m[1]);
  for (const f of scripts().concat('app.css', APP_HTML, 'manifest.webmanifest')) {
    assert.ok(fs.existsSync(path.join(WEB, f)), f + ': trang nạp nhưng tệp không tồn tại');
    assert.ok(shell.includes(f), f + ': chưa có trong SHELL của sw.js nên sẽ thiếu khi mất mạng');
  }
  for (const f of shell) if (f) assert.ok(fs.existsSync(path.join(WEB, f)), f + ': có trong SHELL nhưng tệp không tồn tại');
  assert.deepEqual(webJs.filter(f => f !== 'sw.js' && !scripts().includes(f)), [], 'tệp .js trong web/ không được trang nạp');
});

test('liên kết mở tab mới đều có rel="noopener noreferrer"', () => {
  for (const f of ['app.js', 'view_congthuc.js', APP_HTML]) {
    const s = read(WEB, f);
    for (const m of s.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.match(m[0], /rel="[^"]*noopener[^"]*noreferrer[^"]*"/, f + ': ' + m[0].slice(0, 80));
  }
});

test('kho mã không chứa bí mật, thư điện tử hay đường dẫn máy cá nhân', () => {
  const skip = new Set(['.git', 'node_modules', 'ban_phat_hanh', 'de_tham_khao', 'Hinh', '.claude', '.netlify', '__pycache__']);
  const exts = new Set(['.js', '.py', '.html', '.css', '.md', '.txt', '.json', '.toml', '.yml', '.webmanifest']);
  const bad = [];
  const rules = [
    [/[A-Za-z]:\\Users\\/, 'đường dẫn thư mục người dùng Windows'],
    [/[A-Za-z0-9._%+-]+@(gmail|yahoo|outlook|hotmail|icloud)\.[a-z.]+/i, 'địa chỉ thư điện tử cá nhân'],
    [/\b(ghp|gho|ghu|ghs|github_pat)_[A-Za-z0-9_]{20,}/, 'token GitHub'],
    [/\bnfp_[A-Za-z0-9]{20,}/, 'token Netlify'],
    [/\bsk-[A-Za-z0-9-]{20,}/, 'khóa API'],
    [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'khóa bí mật'],
    [/\b(api[_-]?key|secret|password|passwd)\s*[:=]\s*["'][^"']{8,}["']/i, 'bí mật gán cứng']
  ];
  const walk = dir => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (skip.has(e.name)) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      if (!exts.has(path.extname(e.name)) || p === __filename) continue;
      const s = fs.readFileSync(p, 'utf8');
      for (const [re, what] of rules) if (re.test(s)) bad.push(path.relative(ROOT, p) + ': ' + what);
    }
  };
  walk(ROOT);
  assert.deepEqual(bad, []);
});
