# Dựng các tệp loigiai_*.js từ nguồn văn bản trong thư mục này.
# Cú pháp nguồn: dòng "# <khóa>" mở một lời giải; "h <...>" là hướng đi,
# "y <...>" là một ý kiến thức/ý tưởng, "b <...>" là một bước giải (bước cuối nêu đáp án).
# Chạy: py -I content/build.py  (từ thư mục D:\KHKT)
import json, pathlib, sys
sys.stdout.reconfigure(encoding="utf-8")
here = pathlib.Path(__file__).resolve().parent
groups = {"10": "loigiai_10.js", "11": "loigiai_11.js", "12": "loigiai_12.js", "dethi": "loigiai_dethi.js"}
for g, out in groups.items():
    data, cur = {}, None
    for src in sorted(here.glob(f"{g}*.txt")):
        for n, line in enumerate(src.read_text(encoding="utf-8").splitlines(), 1):
            line = line.rstrip()
            if not line.strip():
                continue
            if line.startswith("# "):
                key = line[2:].strip()
                if key in data:
                    sys.exit(f"{src.name}:{n}: khóa lặp {key}")
                cur = data[key] = {"h": "", "y": [], "b": []}
                continue
            tag, _, text = line.partition(" ")
            if cur is None or tag not in ("h", "y", "b"):
                sys.exit(f"{src.name}:{n}: dòng không hợp lệ: {line}")
            if tag == "h":
                cur["h"] = (cur["h"] + " " + text).strip()
            else:
                cur[tag].append(text.strip())
    if not data:
        continue
    body = ",\n".join(f"  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v, ensure_ascii=False)}" for k, v in data.items())
    (here.parent / "web" / out).write_text(
        "// Tệp sinh tự động từ content/ (build.py). Sửa nội dung ở tệp nguồn .txt.\n"
        f"window.KHKT_LG = Object.assign(window.KHKT_LG || {{}}, {{\n{body}\n}});\n", encoding="utf-8")
    print(out, len(data))
