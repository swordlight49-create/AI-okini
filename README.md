# OkiniFood Customer Support Hub (オオキニ食品 - Japan, since 2017)

Hệ thống trang web hỗ trợ khách hàng phong cách Nhật Bản tối giản, tích hợp hiệu ứng hoa anh đào rơi 60fps, AI Chatbot với **1.000 tình huống hỗ trợ**, trọn bộ **Bảng giá HRC ngày 01/09/2026** của **Công ty Cổ phần Đầu tư và Phát triển Hải Đăng Tomi** (`MST: 0314332165`), cùng **Chế độ Admin bí mật** xem lịch sử và chat trực tiếp với khách hàng.

## Cấu trúc dự án

```text
okinifood-support-hub/
├── .gitignore
├── .env.example
├── README.md
├── package.json
├── packages/
│   ├── catalog-tomi/       # Dữ liệu sản phẩm & bảng giá HRC 01/09/2026 (Hải Đăng Tomi)
│   ├── scenarios-1000/     # Kho 1.000 tình huống CSKH & bộ khớp ngữ cảnh Omotenashi
│   └── chat-store/         # Lưu trữ phiên chat, tin nhắn & xác thực Admin
├── server/                 # Express API & phục vụ giao diện tĩnh
│   ├── package.json
│   ├── .env
│   ├── data/chats.json
│   └── src/
│       ├── index.js
│       ├── middleware/adminAuth.js
│       └── routes/
│           ├── chat.routes.js
│           └── admin.routes.js
└── public/
    └── index.html          # Giao diện OkiniFood (Seigaiha, Sakura Canvas 60fps, Chatbot & Admin)
```

## Hướng dẫn cài đặt & chạy nhanh

1. Cài đặt dependencies cho toàn bộ workspace:
   ```bash
   npm install
   ```
2. Khởi chạy server:
   ```bash
   npm start
   ```
3. Mở trình duyệt tại `http://localhost:3000`.
4. **Kích hoạt Admin bí mật:** Mở khung **AI Chatbot** và gửi đúng mã `190120001505200028032000` (mã sẽ được ẩn tự động trên khung chat).
