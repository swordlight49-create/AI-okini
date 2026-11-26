const express = require("express");
const { replyToCustomer } = require("@okinifood/scenarios-1000");

function createChatRouter(chatStore) {
  const router = express.Router();

  // Nhận tin nhắn từ khách hàng hoặc phát hiện mã Admin bí mật
  router.post("/message", (req, res) => {
    const { sessionId, message } = req.body || {};
    if (!sessionId || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ ok: false, error: "Thiếu sessionId hoặc nội dung tin nhắn" });
    }

    const trimmed = message.trim();

    // Kiểm tra mã bí mật Admin (không lưu vào lịch sử chat khách hàng)
    if (chatStore.verifyAdmin(trimmed)) {
      return res.json({
        ok: true,
        adminUnlocked: true,
        adminToken: trimmed
      });
    }

    // Lưu tin nhắn khách hàng
    chatStore.appendMessage(sessionId, {
      sender: "customer",
      text: trimmed
    });

    // Sinh phản hồi từ kho 1.000 tình huống & bảng giá Hải Đăng Tomi
    const botResult = replyToCustomer(trimmed);
    const saved = chatStore.appendMessage(sessionId, {
      sender: "bot",
      text: botResult.reply,
      meta: {
        scenarioId: botResult.matchedScenarioId,
        category: botResult.category
      }
    });

    return res.json({
      ok: true,
      adminUnlocked: false,
      reply: botResult.reply,
      meta: {
        scenarioId: botResult.matchedScenarioId,
        category: botResult.category
      },
      session: saved.session
    });
  });

  // Lấy lịch sử hội thoại của 1 phiên (để đồng bộ tin nhắn Admin phản hồi trực tiếp)
  router.get("/session/:sessionId", (req, res) => {
    const session = chatStore.getSession(req.params.sessionId);
    return res.json({
      ok: true,
      session: session || { sessionId: req.params.sessionId, messages: [] }
    });
  });

  return router;
}

module.exports = { createChatRouter };
