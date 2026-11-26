const { COMPANY_INFO, PRODUCTS } = require("./price-list-2026-09");

function normalize(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

function searchProducts(query, limit = 6) {
  const q = normalize(query);
  if (!q) return [];
  const tokens = q.split(/\s+/).filter((t) => t.length > 1);

  const scored = PRODUCTS.map((p) => {
    const hay = normalize(`${p.name} ${p.category} ${p.spec} ${p.packing} ${p.vat}`);
    let score = 0;
    if (hay.includes(q)) score += 10;
    for (const tk of tokens) {
      if (hay.includes(tk)) score += 2;
    }
    return { product: p, score };
  }).filter((item) => item.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.product);
}

function formatPrice(vnd) {
  return new Intl.NumberFormat("vi-VN").format(vnd) + "đ";
}

module.exports = {
  COMPANY_INFO,
  PRODUCTS,
  searchProducts,
  formatPrice,
  normalize
};
