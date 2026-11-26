const { COMPANY_INFO, searchProducts, formatPrice, normalize } = require("@okinifood/catalog-tomi");
const { build1000Scenarios } = require("./generators");

const SCENARIOS = build1000Scenarios();

function replyToCustomer(message) {
  const raw = (message || "").trim();
  const q = normalize(raw);

  // 1. Kiểm tra nếu khách hỏi danh sách nhóm hàng tổng quan
  if (/bang gia|danh muc|san pham|co nhung gi|menu/.test(q) && q.split(/\s+/).length <= 5) {
    return {
      matchedScenarioId: "SC-CATALOG-OVERVIEW",
      category: "Danh mục sản phẩm HRC",
      reply:
        `Dạ, Bảng giá HRC ngày **${COMPANY_INFO.effectiveDate}** của **${COMPANY_INFO.name}** gồm 4 nhóm chính:\n` +
        `1. **Thịt Bò, Heo Tuyết, Shinko, Wagyu A5 & Bò Mỹ - Úc** (48 mã hàng)\n` +
        `2. **Trứng cá hồi Ikura, Tobiko, Lươn Nhật, Cá trích ép trứng & Phụ liệu Nhật** (12 mã hàng)\n` +
        `3. **Hải sản đóng gói & Hải sản Sashimi nhập khẩu** (34 mã hàng)\n` +
        `4. **Fast Food & Surimi cao cấp** (14 mã hàng)\n\n` +
        `Quý khách gõ tên món (ví dụ: *"Wagyu A5"*, *"Cá hồi sashimi"*, *"Bittet Okini"*, *"Trứng cá hồi"*) để em báo giá chi tiết kèm VAT ngay ạ!`
    };
  }

  // 2. Tìm kiếm khớp sản phẩm trong bảng giá Hải Đăng Tomi
  const matchedProducts = searchProducts(raw, 5);
  if (matchedProducts.length > 0 && !/giao hang|bao quan|ra dong|dia chi|ma so thue|doi tra|khieu nai|xin chao|hello|cam on/.test(q)) {
    const lines = matchedProducts.map(
      (p, i) =>
        `${i + 1}. **${p.name}** (${p.packing} | ${p.spec}) — **${formatPrice(p.price)}/${p.unit}** (Thuế: ${p.vat})`
    );
    return {
      matchedScenarioId: `SC-PROD-MATCH-${matchedProducts[0].id}`,
      category: "Tra cứu Bảng giá HRC 01/09/2026",
      reply:
        `Dạ, theo Bảng giá HRC ban hành ngày **${COMPANY_INFO.effectiveDate}** (Hải Đăng Tomi - MST: ${COMPANY_INFO.mst}), thông tin sản phẩm Quý khách quan tâm như sau:\n\n` +
        lines.join("\n") +
        `\n\n*Ghi chú: Đơn giá đã bao gồm VAT (${matchedProducts[0].vat}). Quý khách cần lên đơn hay tư vấn thêm về quy cách thùng vui lòng nhắn em nhé!*`
    };
  }

  // 3. Khớp trong kho 1.000 tình huống Omotenashi
  const tokens = q.split(/\s+/).filter((t) => t.length > 1);
  let best = null;
  let bestScore = 0;

  for (const sc of SCENARIOS) {
    const hay = normalize(`${sc.category} ${sc.question} ${sc.keywords.join(" ")}`);
    let score = 0;
    if (hay.includes(q) && q.length > 2) score += 12;
    for (const tk of tokens) {
      if (hay.includes(tk)) score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      best = sc;
    }
  }

  if (best && bestScore >= 2) {
    return {
      matchedScenarioId: best.id,
      category: best.category,
      reply: best.answer
    };
  }

  // 4. Fallback lịch sự phong cách Omotenashi
  return {
    matchedScenarioId: "SC-FALLBACK-OMOTENASHI",
    category: "Hỗ trợ Omotenashi",
    reply:
      `Cảm ơn Quý khách đã liên hệ **OkiniFood (オオキニ食品)**! Để em hỗ trợ chính xác nhất theo Bảng giá HRC ngày **${COMPANY_INFO.effectiveDate}** của **${COMPANY_INFO.name}**, Quý khách có thể hỏi tên sản phẩm cụ thể (ví dụ: *Bò Okini Chiên Xù, Wagyu A5, Cồi sò điệp Nhật, Thanh cua Thái Lan...*) hoặc hỏi về chính sách giao hàng, bảo quản và xuất hóa đơn VAT ạ.`
  };
}

module.exports = {
  SCENARIOS,
  replyToCustomer
};
