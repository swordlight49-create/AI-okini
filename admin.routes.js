const express = require("express");

function createAdminRouter(chatStore, adminAuth) {
  const router = express.Router();

  router.use(adminAuth);

  // Danh sách toàn bộ phiên hội thoại
  router.get("/sessions", (req, res) => {
    const q = req.query.q || "";
    const sessions = chatStore.listSessions(q);
    res.json({ ok: true, total: sessions.length, sessions });
  });

  // Admin nhắn tin phản hồi trực tiếp vào phiên của khách hàng
  router.post("/sessions/:sessionId/reply", (req, res) => {
    const { text } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ ok: false, error: "Nội dung phản hồi trống" });
    }
    const result = chatStore.appendMessage(req.params.sessionId, {
      sender: "admin",
      text: text.trim(),
      meta: { role: "Phòng Kinh Doanh - Hải Đăng Tomi" }
    });
    res.json({ ok: true, session: result.session, message: result.message });
  });

  // Xuất toàn bộ dữ liệu hội thoại dạng JSON
  router.get("/export", (req, res) => {
    const sessions = chatStore.listSessions("");
    res.setHeader("Content-Disposition", "attachment; filename=okinifood-chats-export.json");
    res.json({ exportedAt: new Date().toISOString(), totalSessions: sessions.length, sessions });
  });

  // Xóa một phiên hội thoại
  router.delete("/sessions/:sessionId", (req, res) => {
    const deleted = chatStore.deleteSession(req.params.sessionId);
    res.json({ ok: deleted });
  });

  return router;
}

module.exports = { createAdminRouter };
