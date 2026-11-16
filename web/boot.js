// Chạy trước khi vẽ trang: đặt giao diện sáng/tối đã chọn để không bị nháy màu,
// và đánh dấu khi chạy trên Netlify (gói miễn phí có huy hiệu cố định ở đáy màn hình).
try{var t=localStorage.getItem('khkt-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}
if (/\.netlify\.app$/.test(location.hostname)) document.documentElement.classList.add('nf-badge');
