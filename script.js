/* ============================================================
   Ho Services – script.js
   Pure vanilla JS: navbar, scroll animations, FAQ,
   product filter, stats counter, form handling
   ============================================================ */

/* ---- Navbar: scroll class + active link ---- */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const links    = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    /* highlight active nav link based on viewport position */
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---- Hamburger mobile menu ---- */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const menu  = document.getElementById('navLinks');

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  /* close on link click */
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
    });
  });

  /* close on outside click */
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('open');
    }
  });
})();

/* ---- Scroll reveal (IntersectionObserver) ---- */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();

/* ---- Animated stats counter ---- */
(function initStats() {
  const nums = document.querySelectorAll('.stat-num');
  if (!nums.length) return;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el, target, duration) {
    const start = performance.now();
    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOut(progress) * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el     = e.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target, 1800);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(n => io.observe(n));
})();

/* ---- FAQ accordion ---- */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');

    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';

      /* close all others */
      items.forEach(i => {
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        i.querySelector('.faq-a').classList.remove('open');
      });

      /* toggle current */
      if (!open) {
        btn.setAttribute('aria-expanded', 'true');
        ans.classList.add('open');
      }
    });
  });
})();

/* ---- Product filter ---- */
(function initFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.product-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden-filter');
          /* re-trigger reveal if needed */
          card.classList.add('visible');
        } else {
          card.classList.add('hidden-filter');
        }
      });
    });
  });
})();

/* ---- File upload label ---- */
(function initFileUpload() {
  const input   = document.getElementById('artwork');
  const nameEl  = document.getElementById('fileName');
  const area    = document.getElementById('fileUploadArea');
  if (!input) return;

  input.addEventListener('change', () => {
    if (input.files.length) {
      nameEl.textContent = input.files[0].name;
      area.classList.add('active');
    } else {
      nameEl.textContent = '';
      area.classList.remove('active');
    }
  });
})();

/* ---- Quote form with FormSubmit ---- */
(function initForm() {
  const form       = document.getElementById('quoteForm');
  const submitBtn  = document.getElementById('submitBtn');
  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoader  = submitBtn.querySelector('.btn-loader');
  const successEl  = document.getElementById('formSuccess');
  const errorEl    = document.getElementById('formError');

  /* field validation rules */
  const rules = [
    {
      id: 'name', errId: 'nameError',
      validate: v => v.trim().length >= 2,
      msg: 'Please enter your full name.'
    },
    {
      id: 'email', errId: 'emailError',
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      msg: 'Please enter a valid email address.'
    },
    {
      id: 'phone', errId: 'phoneError',
      validate: v => /^[\d\s\+\-\(\)]{6,20}$/.test(v.trim()),
      msg: 'Please enter a valid phone number.'
    },
    {
      id: 'service', errId: 'serviceError',
      validate: v => v !== '',
      msg: 'Please select a printing service.'
    },
    {
      id: 'message', errId: 'messageError',
      validate: v => v.trim().length >= 10,
      msg: 'Please describe your requirements (at least 10 characters).'
    }
  ];

  function validateField(rule) {
    const el  = document.getElementById(rule.id);
    const err = document.getElementById(rule.errId);
    if (!el) return true;

    const ok = rule.validate(el.value);
    err.textContent = ok ? '' : rule.msg;
    el.classList.toggle('error', !ok);
    return ok;
  }

  /* live validation on blur */
  rules.forEach(rule => {
    const el = document.getElementById(rule.id);
    if (el) el.addEventListener('blur', () => validateField(rule));
  });

  function setLoading(loading) {
    submitBtn.disabled = loading;
    btnText.classList.toggle('hidden', loading);
    btnLoader.classList.toggle('hidden', !loading);
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    /* validate all fields */
    const allValid = rules.map(r => validateField(r)).every(Boolean);
    if (!allValid) {
      /* scroll to first error */
      const firstErr = form.querySelector('.error');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    successEl.classList.add('hidden');
    errorEl.classList.add('hidden');

    /* Build form data for FormSubmit.co */
    const fd = new FormData(form);
    fd.append('_subject', 'New Print Quote Request – Ho Services');
    fd.append('_template', 'table');
    fd.append('_captcha', 'false');

    /* Replace YOUR_EMAIL with the actual destination email */
    const FORM_ENDPOINT = 'https://formsubmit.co/ajax/hoservices1@gmail.com';

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        successEl.classList.remove('hidden');
        form.reset();
        document.getElementById('fileName').textContent = '';
        document.getElementById('fileUploadArea').classList.remove('active');
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        throw new Error('Server error');
      }
    } catch {
      errorEl.classList.remove('hidden');
    } finally {
      setLoading(false);
    }
  });
})();

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80; /* navbar height buffer */
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---- Back to top ---- */
(function initBackTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ---- Language toggle (EN / 中文) ---- */
(function initLang() {

  const T = {
    en: {
      /* navbar */
      navHome:'Home', navServices:'Services', navProducts:'Products',
      navWhyUs:'Why Us', navQuote:'Quote', navContact:'Contact',
      navCta:'Get a Quote',
      /* hero */
      heroBadge:' Trusted Print Partner in Singapore',
      heroLine1:'Fast, Reliable', heroAccent:'Printing Services', heroLine3:'in Singapore',
      heroSub:'From business cards to flyers, stickers, booklets, binding, scanning, and corporate printing —<br class="hide-mobile" /> Ho Services delivers quality prints with quick turnaround.',
      heroBtnQuote:'Request a Quote', heroBtnServices:'View Services',
      heroStat1:'Years of Experience', heroStat2:'Print Services', heroStat3:'Turnaround',
      /* about */
      aboutTagline:"Singapore's Trusted Print Partner", aboutBadgeLabel:'Years of Experience',
      aboutLabel:'About Ho Services',
      aboutTitle:'Your Trusted Print Partner <span class="accent">Since Day One</span>',
      aboutDesc:'Ho Services is a Singapore-based printing store offering a comprehensive range of design, printing, photocopying, scanning, and binding services. Serving businesses, students, schools, and walk-in customers with pride for over three decades.',
      aboutF1T:'Fast Turnaround',      aboutF1D:'Quick print jobs without compromising on quality',
      aboutF2T:'Competitive Pricing',  aboutF2D:'Affordable rates for every budget and print volume',
      aboutF3T:'Quality Finish',       aboutF3D:'Professional print finishing on every order',
      aboutF4T:'Friendly Service',     aboutF4D:'Helpful staff ready to assist businesses and students',
      aboutCta:'Get a Free Quote',
      /* services */
      servicesLabel:'What We Offer',
      servicesTitle:'Our <span class="accent">Printing Services</span>',
      servicesSub:'Comprehensive print solutions for businesses, students, and organisations across Singapore',
      serviceCta:'Request a Custom Quote',
      scLink:'Get a Quote →',
      sc:['Business Card Printing','Flyer / Brochure Printing','Sticker Printing','Letterhead Printing','Envelope Printing','Invoice Printing','ID Card Printing','Voucher Printing','Booklet Printing','Photocopying','Scanning','Binding','Artwork Design','Large Format Printing','Banner / Poster Printing','Rubber Stamps'],
      sd:['Premium business cards in various finishes — matte, gloss, velvet, and UV spot varnish.','Eye-catching flyers and brochures in A4, A5, DL and custom sizes — single or double-sided.','Custom cut stickers, label rolls, transparent, and waterproof stickers for any application.','Professional corporate letterheads that make a strong impression on every correspondence.','Custom printed envelopes with your logo and address — DL, C4, C5 sizes and more.','Carbonless NCR invoice books, receipt pads, and numbered invoice sets for your business.','Professional PVC ID cards, staff passes, membership cards with optional lamination.','Numbered gift vouchers, coupon books, and promotional vouchers with security features.','Saddle-stitched and perfect-bound booklets, catalogues, and company profiles.','Fast black-and-white and colour photocopying in A4, A3, and custom sizes — walk-in welcome.','High-resolution document scanning to PDF, JPEG, or TIFF — A4 and A3 documents accepted.','Spiral, comb, thermal, and perfect binding for reports, theses, and presentations.','Professional graphic design for your print materials — logo, layout, and ready-to-print files.','Wide-format prints up to A0 and beyond — posters, foam boards, canvas, and roll-up displays.','Indoor and outdoor banners, fabric banners, pull-up banners, and exhibition stands.','Custom self-inking and pre-inked stamps — ideal for company logos, signatures, and office use.'],
      /* products */
      productsLabel:'Our Work',
      productsTitle:'Print <span class="accent">Products Showcase</span>',
      productsSub:'Browse our range of printed materials',
      filterAll:'All', filterBusiness:'Business Printing', filterMarketing:'Marketing Materials',
      filterDocument:'Document Services', filterLarge:'Large Format',
      getQuote:'Get Quote',
      pc:['Business Cards','Flyers &amp; Brochures','Stickers &amp; Labels','Booklets &amp; Catalogues','Posters','Roll-up Banners','ID Cards','Binding &amp; Reports','Corporate Stationery','Vouchers','Lamination','Rubber Stamps','Invoices','Letterheads','Scanning','Mounting Boards','Easel Stands','PVC Banners'],
      pd:['Premium matte &amp; gloss finish','A4, A5, DL &amp; custom sizes','Custom shapes, waterproof options','Saddle-stitched &amp; perfect-bound','A3, A2, A1, A0 &amp; custom','Indoor &amp; exhibition displays','Staff passes &amp; membership cards','Spiral, comb &amp; thermal binding','Letterheads, envelopes &amp; pads','Gift &amp; discount vouchers','Gloss, matte &amp; anti-glare finishes','Self-inking &amp; custom designs','Duplicate &amp; triplicate books','Branded A4 company stationery','A4, A3 &amp; large-format scanning','Foam &amp; rigid board mounting','Tabletop &amp; floor display stands','Outdoor &amp; indoor vinyl banners'],
      /* why us */
      whyusLabel:'Why Choose Us',
      whyusTitle:'Why <span class="accent">Ho Services?</span>',
      whyusSub:'Your satisfaction is our priority — backed by decades of printing expertise',
      bt:['30 Years of Experience','Wide Range of Services','Competitive Pricing','Fast Turnaround','Design &amp; Print Support','Easy Quote Request'],
      bd:['Decades of hands-on expertise in design and printing. We know what works for every print job.','From a single business card to a thousand banners — we handle all types of print orders.','Transparent, affordable pricing with no hidden costs. Great quality at the right price.','Urgent jobs handled with care. We deliver on time so your business never misses a deadline.',"Don't have a print-ready file? Our designers can help create or fix your artwork.",'Request a quote online in minutes — no complicated forms, just tell us what you need.'],
      statL:['Years of Experience','Print Services','Pages Printed','On-Time Delivery'],
      /* faq */
      faqLabel:'Common Questions',
      faqTitle:'Frequently Asked <span class="accent">Questions</span>',
      faqQ:['What file formats do you accept for printing?','How long does printing take?',"Can you help with design if I don't have artwork?",'Is there a minimum order quantity?','Do you offer delivery services?'],
      faqA:['We accept PDF (preferred), AI, PSD, CDR, DOCX, JPEG, and PNG files. For best results, please send print-ready PDF files with 3mm bleed, 300dpi resolution, and CMYK colour mode.','Standard turnaround is 3–5 working days. Rush and same-day services are available for selected items. Contact us to discuss your deadline and we will do our best to accommodate.','Yes! Our in-house design team can create professional artwork for your print jobs. Share any logos or brand guidelines and we will prepare a design for your approval before printing.','Business cards start from 50 pieces. Flyers from 100 copies. There is no minimum for walk-in photocopying and scanning. Contact us for custom quantities and bulk pricing.','Yes, we offer delivery to addresses in Singapore for orders above a minimum spend. Self-collection from our store is also available. Contact us for delivery rates and timelines.'],
      /* quote */
      quoteLabel:'Free Quote',
      quoteTitle:'Request a <span class="accent">Print Quote</span>',
      quoteDesc:"Fill in your requirements and we'll get back to you with a competitive price — usually within the same business day.",
      qf:['No obligation, free quote','Fast response within 24 hours','Competitive pricing guaranteed','Design support available'],
      waBtn:'WhatsApp Us',
      labelName:'Full Name', labelEmail:'Email Address', labelPhone:'Phone Number',
      labelCompany:'Company Name', labelService:'Printing Service', labelQty:'Quantity',
      labelDeadline:'Preferred Deadline', labelArtwork:'Artwork File', labelMessage:'Message / Requirements',
      phName:'Your full name', phEmail:'you@example.com', phPhone:'+65 XXXX XXXX',
      phCompany:'Your company (optional)', phQty:'e.g. 500',
      phMessage:'Describe your printing requirements, paper type, size, finishing preferences, etc.',
      uploadText:'Click to upload artwork',
      selectDefault:'-- Select a Service --',
      submitBtn:'Send Quote Request', sending:'Sending...',
      successMsg:"<strong>Quote request sent!</strong> We'll get back to you within 24 hours. Thank you!",
      errorMsg:'Something went wrong. Please try again or contact us directly.',
      /* contact */
      contactLabel:'Get in Touch',
      contactTitle:'Visit or <span class="accent">Contact Us</span>',
      contactSub:"We're here to help. Walk in, call, or send us a message anytime.",
      ccH:['Store Name','Address','Phone','Email','Opening Hours'],
      hoursText:'Mon – Fri: 9:00am – 8:00pm<br />Sat – Sun: 9:00am – 6:00pm',
      getDirections:'Get Directions',
      waTooltip:'Chat on WhatsApp',
      /* footer */
      footerTagline:'Fast, Reliable Printing Services in Singapore. Quality print finishing with 30 years of experience.',
      footerH:['Quick Links','Print Services','Contact'],
      fLinks:['Home','About Us','Services','Products','Why Choose Us','Request Quote','Contact'],
      fServices:['Business Card Printing','Flyer Printing','Sticker Printing','Booklet Printing','Banner Printing','Binding Services','Artwork Design'],
      footerCopy:'© 2025 Ho Services. All rights reserved. | Printing Services Singapore',
    },

    zh: {
      /* navbar */
      navHome:'首页', navServices:'服务', navProducts:'产品',
      navWhyUs:'为何选我们', navQuote:'报价', navContact:'联系',
      navCta:'获取报价',
      /* hero */
      heroBadge:' 新加坡值得信赖的印刷伙伴',
      heroLine1:'快速可靠', heroAccent:'印刷服务', heroLine3:'在新加坡',
      heroSub:'从名片到传单、贴纸、书册、装订、扫描及企业印刷——<br class="hide-mobile" />Ho Services提供优质印刷，快速交货。',
      heroBtnQuote:'申请报价', heroBtnServices:'查看服务',
      heroStat1:'年经验', heroStat2:'印刷服务', heroStat3:'快速交货',
      /* about */
      aboutTagline:'新加坡值得信赖的印刷伙伴', aboutBadgeLabel:'年经验',
      aboutLabel:'关于Ho Services',
      aboutTitle:'您值得信赖的印刷伙伴 <span class="accent">始终如一</span>',
      aboutDesc:'Ho Services是一家提供全面设计、印刷、复印、扫描和装订服务的新加坡印刷店。三十年来，我们以骄傲的态度为企业、学生、学校及散客提供服务。',
      aboutF1T:'快速交货',      aboutF1D:'不牺牲质量的快速印刷工作',
      aboutF2T:'具竞争力的价格', aboutF2D:'适合各种预算和印量的实惠价格',
      aboutF3T:'优质完成',      aboutF3D:'每份订单均有专业印刷完成',
      aboutF4T:'友好服务',      aboutF4D:'热心员工随时协助企业和学生',
      aboutCta:'获取免费报价',
      /* services */
      servicesLabel:'我们提供的服务',
      servicesTitle:'我们的<span class="accent">印刷服务</span>',
      servicesSub:'为新加坡各地企业、学生和机构提供全面的印刷解决方案',
      serviceCta:'申请定制报价',
      scLink:'获取报价 →',
      sc:['名片印刷','传单／小册子印刷','贴纸印刷','信头印刷','信封印刷','发票印刷','证件印刷','优惠券印刷','书册印刷','复印','扫描','装订','美术设计','大幅印刷','横幅／海报印刷','橡皮图章'],
      sd:['各种光面名片——哑光、亮光、丝绒及UV点光油。','各种尺寸的彩色传单和小册子——A4、A5、DL及定制尺寸。','定制形状贴纸、标签卷、透明及防水贴纸，适用于各种用途。','专业企业信头，让每次通信留下深刻印象。','带有您标志和地址的定制印刷信封——DL、C4、C5等尺寸。','无碳复写发票本、收据本及编号发票套装。','专业PVC证件、员工通行证、会员卡（可选覆膜）。','编号礼品券、优惠券本及附安全特征的宣传券。','骑马订和完美装订书册、目录及公司简介。','快速黑白及彩色复印——A4、A3及定制尺寸，欢迎散客。','高分辨率文件扫描为PDF、JPEG或TIFF——接受A4和A3文件。','螺旋、梳形、热熔及完美装订，适用于报告、论文及演示文稿。','为您的印刷材料提供专业平面设计——标志、版式及印刷就绪文件。','宽幅印刷至A0及以上——海报、泡沫板、帆布及展示架。','室内外横幅、布质横幅、展示架及展览架。','定制自动和预墨图章——适合公司标志、签名及办公用途。'],
      /* products */
      productsLabel:'我们的作品',
      productsTitle:'印刷<span class="accent">产品展示</span>',
      productsSub:'浏览我们的印刷产品系列',
      filterAll:'全部', filterBusiness:'商业印刷', filterMarketing:'营销材料',
      filterDocument:'文件服务', filterLarge:'大幅印刷',
      getQuote:'获取报价',
      pc:['名片','传单和小册子','贴纸和标签','书册和目录','海报','展示架','证件','装订和报告','企业文具','优惠券','覆膜','橡皮图章','发票','信头','扫描','装裱板','画架支架','PVC横幅'],
      pd:['优质哑光和亮光完成','A4、A5、DL及定制尺寸','定制形状、防水选项','骑马订和完美装订','A3、A2、A1、A0及定制','室内及展览展示','员工通行证和会员卡','螺旋、梳形及热熔装订','信头、信封和便笺','礼品和折扣券','亮光、哑光及防眩光完成','自动和定制设计','复写和三联本','品牌A4企业文具','A4、A3及大幅扫描','泡沫及硬板装裱','桌面及落地展示架','室内外乙烯基横幅'],
      /* why us */
      whyusLabel:'为何选择我们',
      whyusTitle:'为何选择<span class="accent">Ho Services？</span>',
      whyusSub:'您的满意是我们的首要任务——以数十年印刷专业知识为后盾',
      bt:['30年经验','广泛服务范围','具竞争力的价格','快速交货','设计和印刷支持','轻松报价申请'],
      bd:['在设计和印刷方面拥有数十年实战经验，了解每种印刷工作的最佳方案。','从一张名片到一千条横幅——我们处理所有类型的印刷订单。','透明、实惠的价格，无隐藏费用。优质品质，合理价格。','紧急工作用心处理，我们准时交付，让您的业务不错过任何截止日期。','没有印刷就绪文件？我们的设计师可帮助创建或修改您的美术稿。','在线几分钟内申请报价——无复杂表格，只需告诉我们您的需求。'],
      statL:['年经验','印刷服务','印张出品','准时交付率'],
      /* faq */
      faqLabel:'常见问题',
      faqTitle:'常见<span class="accent">问题</span>',
      faqQ:['您接受哪些文件格式？','印刷需要多长时间？','如果没有美术稿，您能帮助设计吗？','是否有最低订购量？','您提供送货服务吗？'],
      faqA:['我们接受PDF（首选）、AI、PSD、CDR、DOCX、JPEG和PNG文件。为获得最佳效果，请发送带3mm出血、300dpi分辨率和CMYK色彩模式的印刷就绪PDF文件。','标准交货期为3–5个工作日，部分产品提供加急及当天服务。请联系我们讨论截止日期，我们将尽力配合。','可以！我们的内部设计团队可为您的印刷工作创建专业美术稿。提供标志或品牌指南，我们将在印刷前为您准备设计供审批。','名片从50张起，传单从100份起。步入式复印和扫描无最低要求。请联系我们了解定制数量和批量价格。','是的，我们为最低消费以上的订单提供新加坡地址送货，也可到店自取。请联系我们了解送货费率和时间。'],
      /* quote */
      quoteLabel:'免费报价',
      quoteTitle:'申请<span class="accent">印刷报价</span>',
      quoteDesc:'填写您的需求，我们将在同一工作日内回复具有竞争力的价格。',
      qf:['无义务免费报价','24小时内快速回复','保证具竞争力的价格','提供设计支持'],
      waBtn:'WhatsApp联系',
      labelName:'全名', labelEmail:'电子邮件', labelPhone:'电话号码',
      labelCompany:'公司名称', labelService:'印刷服务', labelQty:'数量',
      labelDeadline:'首选截止日期', labelArtwork:'美术稿文件', labelMessage:'留言／需求',
      phName:'您的全名', phEmail:'you@example.com', phPhone:'+65 XXXX XXXX',
      phCompany:'您的公司（可选）', phQty:'例如 500',
      phMessage:'请描述您的印刷需求、纸张类型、尺寸、完成偏好等。',
      uploadText:'点击上传美术稿',
      selectDefault:'-- 请选择服务 --',
      submitBtn:'发送报价申请', sending:'发送中...',
      successMsg:'<strong>报价申请已发送！</strong>我们将在24小时内回复您。谢谢！',
      errorMsg:'出现错误，请重试或直接联系我们。',
      /* contact */
      contactLabel:'联系我们',
      contactTitle:'来访或<span class="accent">联系我们</span>',
      contactSub:'我们随时为您服务。欢迎亲临、致电或随时发送消息。',
      ccH:['商店名称','地址','电话','电子邮件','营业时间'],
      hoursText:'周一至五：上午9时至晚上8时<br />周六至日：上午9时至下午6时',
      getDirections:'获取路线',
      waTooltip:'WhatsApp聊天',
      /* footer */
      footerTagline:'新加坡快速可靠印刷服务。30年经验，优质印刷完成。',
      footerH:['快捷链接','印刷服务','联系方式'],
      fLinks:['首页','关于我们','服务','产品','为何选择我们','申请报价','联系'],
      fServices:['名片印刷','传单印刷','贴纸印刷','书册印刷','横幅印刷','装订服务','美术设计'],
      footerCopy:'© 2025 Ho Services. 版权所有。| 新加坡印刷服务',
    }
  };

  function applyLang(lang) {
    const t = T[lang];
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    localStorage.setItem('hoLang', lang);

    function qi(id)       { return document.getElementById(id); }
    function qs(sel)      { return document.querySelector(sel); }
    function qsa(sel)     { return document.querySelectorAll(sel); }
    function set(sel, v)  { const el = qs(sel); if (el) el.innerHTML = v; }
    function setArr(sel, arr) {
      qsa(sel).forEach((el, i) => { if (arr[i] !== undefined) el.innerHTML = arr[i]; });
    }
    function ph(id, v)    { const el = qi(id); if (el) el.placeholder = v; }

    /* -- navbar -- */
    set('a.nav-link[href="#home"]',    t.navHome);
    set('a.nav-link[href="#services"]',t.navServices);
    set('a.nav-link[href="#products"]',t.navProducts);
    set('a.nav-link[href="#why-us"]',  t.navWhyUs);
    set('a.nav-link[href="#quote"]',   t.navQuote);
    set('a.nav-link[href="#contact"]', t.navContact);
    const navCta = qs('.nav-actions .btn-primary');
    if (navCta) navCta.textContent = t.navCta;

    /* -- hero -- */
    set('.badge-text', t.heroBadge);
    set('[data-i18n="heroLine1"]', t.heroLine1);
    set('[data-i18n="heroAccent"]', t.heroAccent);
    set('[data-i18n="heroLine3"]', t.heroLine3);
    set('.hero-sub', t.heroSub);
    const heroBtns = qsa('.hero-btns .btn');
    if (heroBtns[0]) heroBtns[0].textContent = t.heroBtnQuote;
    if (heroBtns[1]) heroBtns[1].textContent = t.heroBtnServices;
    const hstats = qsa('.hstat span');
    if (hstats[0]) hstats[0].textContent = t.heroStat1;
    if (hstats[1]) hstats[1].textContent = t.heroStat2;
    if (hstats[2]) hstats[2].textContent = t.heroStat3;

    /* -- about -- */
    set('.badge-label', t.aboutBadgeLabel);
    set('#about .section-label', t.aboutLabel);
    set('#about .section-title', t.aboutTitle);
    set('.about-desc', t.aboutDesc);
    const af = qsa('.about-feature');
    [[t.aboutF1T,t.aboutF1D],[t.aboutF2T,t.aboutF2D],[t.aboutF3T,t.aboutF3D],[t.aboutF4T,t.aboutF4D]]
      .forEach(([title,desc], i) => {
        if (!af[i]) return;
        af[i].querySelector('strong').textContent = title;
        af[i].querySelector('p').textContent = desc;
      });
    set('#about .btn-primary', t.aboutCta);

    /* -- services -- */
    set('#services .section-label', t.servicesLabel);
    set('#services .section-title', t.servicesTitle);
    set('#services .section-sub', t.servicesSub);
    const scH3  = qsa('.services-grid .service-card h3');
    const scP   = qsa('.services-grid .service-card p');
    const scLnk = qsa('.services-grid .sc-link');
    t.sc.forEach((v, i) => { if (scH3[i])  scH3[i].textContent  = v; });
    t.sd.forEach((v, i) => { if (scP[i])   scP[i].textContent   = v; });
    scLnk.forEach(el => { el.innerHTML = t.scLink; });
    set('.section-cta .btn-primary', t.serviceCta);

    /* -- products -- */
    set('#products .section-label', t.productsLabel);
    set('#products .section-title', t.productsTitle);
    set('#products .section-sub', t.productsSub);
    const fbBtns = qsa('.filter-btn');
    const filterKeys = ['filterAll','filterBusiness','filterMarketing','filterDocument','filterLarge'];
    fbBtns.forEach((btn, i) => { if (filterKeys[i]) btn.textContent = t[filterKeys[i]]; });
    const pcH4  = qsa('.products-grid .product-card h4');
    const pcP   = qsa('.products-grid .product-card p');
    const pcBtn = qsa('.products-grid .product-overlay .btn');
    t.pc.forEach((v, i) => { if (pcH4[i]) pcH4[i].innerHTML = v; });
    t.pd.forEach((v, i) => { if (pcP[i])  pcP[i].innerHTML  = v; });
    pcBtn.forEach(btn => { btn.textContent = t.getQuote; });

    /* -- why us -- */
    set('#why-us .section-label', t.whyusLabel);
    set('#why-us .section-title', t.whyusTitle);
    set('#why-us .section-sub', t.whyusSub);
    const bc = qsa('.benefit-card');
    t.bt.forEach((v, i) => { if (bc[i]) bc[i].querySelector('h3').textContent = v; });
    t.bd.forEach((v, i) => { if (bc[i]) bc[i].querySelector('p').textContent  = v; });
    const stL = qsa('.stat-item p');
    t.statL.forEach((v, i) => { if (stL[i]) stL[i].textContent = v; });

    /* -- faq -- */
    set('#faq .section-label', t.faqLabel);
    set('#faq .section-title', t.faqTitle);
    const fqQ = qsa('.faq-q-text');
    const fqA = qsa('.faq-a p');
    t.faqQ.forEach((v, i) => { if (fqQ[i]) fqQ[i].textContent = v; });
    t.faqA.forEach((v, i) => { if (fqA[i]) fqA[i].textContent = v; });

    /* -- quote form -- */
    set('#quote .section-label', t.quoteLabel);
    set('#quote .section-title', t.quoteTitle);
    set('.quote-desc', t.quoteDesc);
    const qfItems = qsa('.qf-item');
    t.qf.forEach((v, i) => {
      if (!qfItems[i]) return;
      const icon = qfItems[i].querySelector('.qf-icon');
      qfItems[i].textContent = v;
      if (icon) qfItems[i].prepend(icon);
    });
    const waLink = qs('.btn-whatsapp');
    if (waLink) {
      const waSvg = waLink.querySelector('svg');
      waLink.textContent = t.waBtn;
      if (waSvg) waLink.prepend(waSvg);
    }
    /* labels */
    const lbl = id => { const el = qs(`label[for="${id}"]`); return el; };
    const setLbl = (id, text, req) => {
      const el = lbl(id); if (!el) return;
      el.textContent = text + ' ';
      if (req) { const s = document.createElement('span'); s.className='req'; s.textContent='*'; el.appendChild(s); }
    };
    setLbl('name',     t.labelName,     true);
    setLbl('email',    t.labelEmail,    true);
    setLbl('phone',    t.labelPhone,    true);
    setLbl('company',  t.labelCompany,  false);
    setLbl('service',  t.labelService,  true);
    setLbl('quantity', t.labelQty,      false);
    setLbl('deadline', t.labelDeadline, false);
    setLbl('artwork',  t.labelArtwork,  false);
    setLbl('message',  t.labelMessage,  true);
    /* placeholders */
    ph('name',     t.phName);
    ph('email',    t.phEmail);
    ph('phone',    t.phPhone);
    ph('company',  t.phCompany);
    ph('quantity', t.phQty);
    ph('message',  t.phMessage);
    /* upload text */
    const upSpan = qs('.file-upload > span');
    if (upSpan) upSpan.innerHTML = t.uploadText + '<br/><small>PDF, AI, PSD, JPG, PNG</small>';
    /* select default option */
    const svc = qi('service');
    if (svc && svc.options[0]) svc.options[0].text = t.selectDefault;
    /* submit button */
    set('.btn-text', t.submitBtn);
    const sendingSpan = qs('.btn-sending-text');
    if (sendingSpan) sendingSpan.textContent = t.sending;
    /* success / error */
    const succ = qs('#formSuccess p');
    if (succ) succ.innerHTML = t.successMsg;
    const err = qs('#formError p');
    if (err) err.innerHTML = t.errorMsg;

    /* -- contact -- */
    set('#contact .section-label', t.contactLabel);
    set('#contact .section-title', t.contactTitle);
    set('#contact .section-sub', t.contactSub);
    const cc = qsa('.contact-card');
    t.ccH.forEach((v, i) => { if (cc[i]) cc[i].querySelector('h4').textContent = v; });
    if (cc[4]) cc[4].querySelector('p').innerHTML = t.hoursText;
    const mapLink = qs('.map-link');
    if (mapLink) {
      const mapSvg = mapLink.querySelector('svg');
      mapLink.textContent = t.getDirections;
      if (mapSvg) mapLink.prepend(mapSvg);
    }
    set('.wa-tooltip', t.waTooltip);

    /* -- footer -- */
    set('.footer-tagline', t.footerTagline);
    const fCols = qsa('.footer-col');
    t.footerH.forEach((v, i) => { if (fCols[i]) fCols[i].querySelector('h5').textContent = v; });
    if (fCols[0]) {
      const links = fCols[0].querySelectorAll('li a');
      t.fLinks.forEach((v, i) => { if (links[i]) links[i].textContent = v; });
    }
    if (fCols[1]) {
      const links = fCols[1].querySelectorAll('li a');
      t.fServices.forEach((v, i) => { if (links[i]) links[i].textContent = v; });
    }
    set('.footer-bottom p', t.footerCopy);

    /* -- toggle button label -- */
    const toggleBtn = qi('langToggle');
    if (toggleBtn) toggleBtn.textContent = lang === 'zh' ? 'EN' : '中文';
  }

  /* initialise from saved preference */
  const saved = localStorage.getItem('hoLang') || 'en';
  if (saved === 'zh') applyLang('zh');

  const toggleBtn = document.getElementById('langToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = localStorage.getItem('hoLang') || 'en';
      applyLang(current === 'en' ? 'zh' : 'en');
    });
  }
})();

/* ===== Gallery Carousels ===== */
(function () {
  function initCarousel(carouselId, prevId, nextId) {
    const carousel = document.getElementById(carouselId);
    const prev = document.getElementById(prevId);
    const next = document.getElementById(nextId);
    if (!carousel || !prev || !next) return;

    function slideWidth() {
      const slide = carousel.querySelector('.gallery-slide');
      return slide ? slide.offsetWidth + 20 : 340;
    }

    function updateButtons() {
      const scrollable = carousel.scrollWidth > carousel.clientWidth + 2;
      prev.style.display = scrollable ? '' : 'none';
      next.style.display = scrollable ? '' : 'none';
      if (scrollable) {
        prev.disabled = carousel.scrollLeft <= 0;
        next.disabled = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 2;
      }
    }

    prev.addEventListener('click', () => carousel.scrollBy({ left: -slideWidth(), behavior: 'smooth' }));
    next.addEventListener('click', () => carousel.scrollBy({ left: slideWidth(), behavior: 'smooth' }));
    carousel.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
  }

  initCarousel('posterCarousel',   'posterPrev',   'posterNext');
  initCarousel('stickerCarousel',  'stickerPrev',  'stickerNext');
  initCarousel('bindingCarousel',  'bindingPrev',  'bindingNext');
  initCarousel('mountingCarousel', 'mountingPrev', 'mountingNext');
})();
