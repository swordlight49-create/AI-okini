const fs = require("fs");
const path = require("path");

class ChatStore {
  constructor(filePath, adminSecret = "190120001505200028032000") {
    this.filePath = filePath;
    this.adminSecret = adminSecret;
    this.ensureFile();
  }

  ensureFile() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({ sessions: {} }, null, 2), "utf8");
    }
  }

  readData() {
    this.ensureFile();
    try {
      return JSON.parse(fs.readFileSync(this.filePath, "utf8"));
    } catch {
      return { sessions: {} };
    }
  }

  writeData(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf8");
  }

  verifyAdmin(code) {
    return String(code || "").trim() === this.adminSecret;
  }

  appendMessage(sessionId, { sender, text, meta = {} }) {
    const data = this.readData();
    const now = new Date().toISOString();
    if (!data.sessions[sessionId]) {
      data.sessions[sessionId] = {
        sessionId,
        customerLabel: `Khách hàng #${sessionId.slice(-5).toUpperCase()}`,
        createdAt: now,
        updatedAt: now,
        messages: []
      };
    }
    const msg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      sender, // "customer" | "bot" | "admin"
      text,
      timestamp: now,
      meta
    };
    data.sessions[sessionId].messages.push(msg);
    data.sessions[sessionId].updatedAt = now;
    this.writeData(data);
    return { session: data.sessions[sessionId], message: msg };
  }

  getSession(sessionId) {
    const data = this.readData();
    return data.sessions[sessionId] || null;
  }

  listSessions(search = "") {
    const data = this.readData();
    const q = search.toLowerCase().trim();
    const list = Object.values(data.sessions);
    list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    if (!q) return list;
    return list.filter(
      (s) =>
        s.sessionId.toLowerCase().includes(q) ||
        s.customerLabel.toLowerCase().includes(q) ||
        s.messages.some((m) => m.text.toLowerCase().includes(q))
    );
  }

  deleteSession(sessionId) {
    const data = this.readData();
    if (data.sessions[sessionId]) {
      delete data.sessions[sessionId];
      this.writeData(data);
      return true;
    }
    return false;
  }
}

module.exports = { ChatStore };
