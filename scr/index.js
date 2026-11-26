const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const { ChatStore } = require("@okinifood/chat-store");
const { SCENARIOS } = require("@okinifood/scenarios-1000");
const { PRODUCTS } = require("@okinifood/catalog-tomi");
const { createAdminAuth } = require("./middleware/adminAuth");
const { createChatRouter } = require("./routes/chat.routes");
const { createAdminRouter } = require("./routes/admin.routes");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_SECRET = process.env.ADMIN_SECRET_CODE || "190120001505200028032000";
const DATA_FILE = path.resolve(__dirname, "..", process.env.DATA_FILE || "./data/chats.json");

const chatStore = new ChatStore(DATA_FILE, ADMIN_SECRET);
const adminAuth = createAdminAuth(chatStore);

app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    brand: "OkiniFood (オオキニ食品 - Japan, since 2017)",
    scenariosLoaded: SCENARIOS.length,
    productsLoaded: PRODUCTS.length
  });
});

app.use("/api/chat", createChatRouter(chatStore));
app.use("/api/admin", createAdminRouter(chatStore, adminAuth));

// Phục vụ giao diện tĩnh
const publicDir = path.resolve(__dirname, "../../public");
app.use(express.static(publicDir));
app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`[OkiniFood Support Hub] Server đang chạy tại http://localhost:${PORT}`);
  console.log(`[OkiniFood Knowledge Base] Đã nạp ${SCENARIOS.length} tình huống & ${PRODUCTS.length} sản phẩm HRC.`);
});
