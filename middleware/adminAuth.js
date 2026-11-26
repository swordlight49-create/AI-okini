function createAdminAuth(chatStore) {
  return function adminAuth(req, res, next) {
    const code = req.headers["x-admin-code"] || req.query.code || req.body?.code;
    if (!chatStore.verifyAdmin(code)) {
      return res.status(401).json({ ok: false, error: "Unauthorized admin access" });
    }
    next();
  };
}

module.exports = { createAdminAuth };
