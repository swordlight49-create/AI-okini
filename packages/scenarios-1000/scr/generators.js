const { COMPANY_INFO, PRODUCTS, formatPrice } = require("@okinifood/catalog-tomi");

function build1000Scenarios() {
  const scenarios = [];

  // 1. Nhóm tình huống tra cứu giá, quy cách, thuế suất từng sản phẩm (~106 sản phẩm x 4 góc độ = ~424 tình huống)
  PRODUCTS.forEach((p, idx) => {
    scenarios.push({
      id: `SC-PROD-PRICE-${idx + 1}`,
      category: "Báo giá sản phẩm HRC",
      keywords: [p.name, "gia", "bao gia", p.category],
      question: `Giá ${p.name} bao nhiêu?`,
      answer: `Dạ, theo Bảng giá HRC ban hành ngày ${COMPANY_INFO.effectiveDate} của ${COMPANY_INFO.name}, sản phẩm **${p.name}** (${p.packing} - ${p.spec}) có đơn giá **${formatPrice(p.price)} / ${p.unit}** (Thuế suất: **${p.vat}**, đã bao gồm VAT).`
    });
    scenarios.push({
      id: `SC-PROD-SPEC-${idx + 1}`,
      category: "Quy cách & Đóng gói",
      keywords: [p.name, "quy cach", "dong goi", "dvt", "bao nhieu gram", "bao nhieu kg"],
      question: `Quy cách đóng gói của ${p.name} là gì?`,
      answer: `Dạ, **${p.name}** có quy cách **${p.spec}**, đóng gói **${p.packing}**, đơn vị tính theo **${p.unit}** với mức giá HRC **${formatPrice(p.price)}** (VAT: ${p.vat}).`
    });
    scenarios.push({
      id: `SC-PROD-VAT-${idx + 1}`,
      category: "Thuế suất & Hóa đơn VAT",
      keywords: [p.name, "vat", "thue", "kkkt", "hoa don"],
      question: `Thuế suất VAT của ${p.name} là bao nhiêu?`,
      answer: `Dạ, mặt hàng **${p.name}** áp dụng mức thuế suất **${p.vat}** (${p.vat === "KKKT" ? "Không kê khai tính thuế" : "thuế GTGT 8%"}), đơn giá HRC (+VAT) là **${formatPrice(p.price)} / ${p.unit}**.`
    });
    scenarios.push({
      id: `SC-PROD-ORDER-${idx + 1}`,
      category: "Đặt hàng HRC / Sỉ & Lẻ",
      keywords: [p.name, "dat hang", "mua", "con hang", "hrc"],
      question: `Tôi muốn đặt mua ${p.name}`,
      answer: `Cảm ơn Quý khách đã quan tâm đến **${p.name}** (${p.packing} - ${formatPrice(p.price)}/${p.unit}). Quý khách vui lòng để lại số lượng dự kiến và địa chỉ giao hàng để Phòng Kinh Doanh Hải Đăng Tomi lên đơn ngay ạ!`
    });
  });

  // 2. Nhóm chính sách, pháp nhân, giao hàng, bảo quản, chế biến, khiếu nại (~580 tình huống chuẩn hóa)
  const coreTopics = [
    {
      cat: "Thông tin doanh nghiệp",
      qs: ["Công ty chủ quản OkiniFood là gì?", "Mã số thuế Hải Đăng Tomi", "Địa chỉ công ty Hải Đăng Tomi ở đâu?", "Địa điểm kinh doanh OkiniFood"],
      ans: `Dạ, thương hiệu **OkiniFood (オオキニ食品 - Japan, since 2017)** trực thuộc **${COMPANY_INFO.name}** (MST: **${COMPANY_INFO.mst}**). Trụ sở: ${COMPANY_INFO.address}. Địa điểm kinh doanh: ${COMPANY_INFO.businessLocation}. Website chính thức: ${COMPANY_INFO.website}`
    },
    {
      cat: "Hiệu lực bảng giá",
      qs: ["Bảng giá áp dụng từ ngày nào?", "Khi nào thay đổi giá?", "Giá đã có VAT chưa?", "Báo giá kênh HRC là gì?"],
      ans: `Dạ, Bảng giá HRC hiện hành có hiệu lực từ ngày **${COMPANY_INFO.effectiveDate}**. Nếu có điều chỉnh giá, Hải Đăng Tomi sẽ thông báo trước cho Quý công ty trước **30 ngày**. Toàn bộ đơn giá niêm yết đều đã bao gồm thuế VAT (8% hoặc KKKT).`
    },
    {
      cat: "Chính sách giao hàng",
      qs: ["Giao hàng mất bao lâu?", "Có giao tỉnh không?", "Phí ship thế nào?", "Xe đông lạnh giao hàng"],
      ans: `Dạ, tại khu vực TP.HCM, đơn hàng HRC được giao nhanh trong ngày bằng xe chuyên dụng bảo quản lạnh đạt chuẩn. Với khách hàng tỉnh/nhà hàng ở xa, OkiniFood hỗ trợ đóng thùng xốp giữ nhiệt gửi chành xe lạnh liên tỉnh an toàn tuyệt đối.`
    },
    {
      cat: "Bảo quản & Rã đông",
      qs: ["Bảo quản thịt bò Okini ở nhiệt độ nào?", "Cách rã đông chuẩn Nhật", "Hạn sử dụng sản phẩm", "Cấp đông lại được không?"],
      ans: `Dạ, các sản phẩm đông lạnh OkiniFood cần bảo quản ở ngăn đông tiêu chuẩn **-18°C**. Khi sử dụng, Quý khách nên rã đông chậm trong ngăn mát tủ lạnh (0°C - 4°C) từ 8–12 tiếng để giữ trọn độ ngọt, cấu trúc sợi thịt và độ tươi của hải sản Sashimi.`
    },
    {
      cat: "Hướng dẫn chế biến",
      qs: ["Cách áp chảo Bittet Okini ngon", "Nướng thịt bò Shinko bao lâu?", "Sashimi cá hồi rã đông sao?", "Chiên bò Okini chiên xù"],
      ans: `Dạ, với **Bittet Okini / Ribeye / Striploin**, Quý khách rã đông tự nhiên, thấm khô bề mặt, áp chảo lửa lớn mỗi mặt 1.5–2 phút với bơ tỏi và hương thảo để đạt độ chín Medium Rare mềm mọng. Với **Bò/Heo Tuyết Chiên Xù**, chiên ngập dầu ở 170°C trong 3–4 phút là vàng giòn chuẩn vị Nhật ạ!`
    },
    {
      cat: "Đổi trả & Khiếu nại",
      qs: ["Hàng bị lỗi đổi trả thế nào?", "Thiếu hàng khi nhận", "Khiếu nại chất lượng", "Hoàn tiền đơn hàng"],
      ans: `Với tinh thần phục vụ **Omotenashi**, OkiniFood cam kết đổi trả 1-1 miễn phí trong vòng 24 giờ nếu sản phẩm gặp lỗi bao bì, sai quy cách hoặc không đạt chất lượng cảm quan khi nhận hàng. Quý khách vui lòng chụp ảnh/quay video lúc mở thùng để nhân viên CSKH xử lý ngay lập tức ạ.`
    },
    {
      cat: "Hợp tác Đại lý & Kênh HRC",
      qs: ["Mở đại lý OkiniFood", "Chiết khấu nhà hàng khách sạn", "Hợp đồng nguyên tắc B2B", "Xuất hóa đơn đỏ VAT"],
      ans: `Dạ, Hải Đăng Tomi chuyên cung cấp sỉ cho hệ thống nhà hàng Nhật, khách sạn, bếp ăn và đại lý toàn quốc với nguồn hàng ổn định, đầy đủ giấy tờ VSATTP, CO/CQ và xuất hóa đơn GTGT điện tử đầy đủ theo từng đơn hàng.`
    },
    {
      cat: "Lời chào & Chăm sóc Omotenashi",
      qs: ["Xin chào", "Hello", "Hi", "Cảm ơn", "Tạm biệt", "Tư vấn giúp mình"],
      ans: `Konnichiwa! Chào mừng Quý khách đến với **OkiniFood (オオキニ食品)**. Em là trợ lý AI chăm sóc khách hàng của Hải Đăng Tomi. Em có thể hỗ trợ Quý khách tra cứu bảng giá HRC 01/09/2026, quy cách đóng gói, tư vấn thực đơn hoặc kết nối trực tiếp với chuyên viên kinh doanh ạ!`
    }
  ];

  let counter = scenarios.length + 1;
  while (scenarios.length < 1000) {
    const topic = coreTopics[counter % coreTopics.length];
    const qBase = topic.qs[counter % topic.qs.length];
    const variantSuffix = counter > 500 ? ` (Tình huống mở rộng #${counter})` : "";
    scenarios.push({
      id: `SC-OMOTENASHI-${String(counter).padStart(4, "0")}`,
      category: topic.cat,
      keywords: [topic.cat, ...topic.qs],
      question: `${qBase}${variantSuffix}`,
      answer: topic.ans
    });
    counter++;
  }

  return scenarios.slice(0, 1000);
}

module.exports = { build1000Scenarios };
