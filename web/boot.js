// Chạy trước khi vẽ trang: đặt giao diện sáng/tối đã chọn để không bị nháy màu.
try{var t=localStorage.getItem('khkt-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}
