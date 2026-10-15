/* ===== หน้าสินค้า / สั่งซื้อ (product.html?p=<slug>) =====
   ข้อมูลสินค้าด้านล่างคัดจากภาพอ้างอิง (ไม่ใช่ข้อมูลจากฐานข้อมูลจริง)
   เมื่อพร้อมเชื่อมระบบจริง ให้กำหนดตัวเชื่อม 2 ตัวนี้ก่อนโหลดไฟล์นี้ (หรือแก้ฟังก์ชันด้านล่าง):
     window.ExshopCatalog = { get: async slug => ({ ...ข้อมูลสินค้ารูปแบบเดียวกับ CATALOG... }) }
     window.ExshopOrder   = { place: async ({requestId, productId, planId, qty}) => ({ ok:true|false, message?, stock? }) }
   หมายเหตุ: ราคา/สต็อก/การหักเงินต้องตรวจซ้ำที่ฝั่งเซิร์ฟเวอร์ (RLS / RPC) เสมอ ฝั่งหน้าเว็บเป็นเพียงการแสดงผล */
(function () {
  'use strict';
  const $ = s => document.getElementById(s);
  const NF = new Intl.NumberFormat('en-US');

  const CATALOG = {
    unban: {
      id: 'unban', name: 'UNBAN FIVEM', cat: 'FIVEM', img: 'images/products/unban.jpg', sold: 0,
      plans: [{ id: 'lifetime', name: 'ຖາວອນ', price: 0, stock: 0 }],
      details: [
        'ສິ່ງທີ່ຕ້ອງກະກຽມ',
        'Discord ທີ່ສະອາດ 100%',
        'Steam ທີ່ສະອາດ 100%',
        'Rockstar ທີ່ສະອາດ 100%',
        'ຮອງຮັບທຸກ Windows ເວີຊັນ 25H2 ກໍຮອງຮັບ',
        'ສາມາດປົດໄດ້ທັງ Tx Nc Bt Global ແລະ FiveM',
        'ປົດແບນ Bt Global ເປີດຄອມມາໃໝ່ບໍ່ຕ້ອງຣັນ!!'
      ]
    },
    devil: {
      id: 'devil', name: 'DEVIL STAR', cat: 'FIVEM', img: 'images/products/devil.jpg', sold: 0,
      plans: [{ id: 'default', name: 'ປົກກະຕິ', price: 0, stock: 0 }],
      details: []
    },
    card: {
      id: 'card', name: 'CARD (ຄ່າຍຂາວ)', cat: 'FIVEM', img: 'images/products/card.jpg', sold: 0,
      plans: [{ id: 'default', name: 'ປົກກະຕິ', price: 0, stock: 0 }],
      details: []
    },
    setting: {
      id: 'setting', name: 'SETTING PERFECTX', cat: 'FIVEM', img: 'images/products/setting.jpg', sold: 0,
      plans: [{ id: 'default', name: 'ປົກກະຕິ', price: 0, stock: 0 }],
      details: []
    },
    xlight: {
      id: 'xlight', name: 'CMD XLIGHT', cat: 'FIVEM', img: 'images/products/xlight.jpg', sold: 0,
      plans: [{ id: 'default', name: 'ປົກກະຕິ', price: 0, stock: 0 }],
      details: []
    },
    unlock: {
      id: 'unlock', name: 'UnlockSkin (Starcommu) ບໍ່ຕ້ອງເຕີມຊື້ສະກິນ', cat: 'FIVEM', img: 'images/products/unlock.jpg', sold: 0,
      plans: [{ id: 'default', name: 'ປົກກະຕິ', price: 0, stock: 0 }],
      details: []
    },
    collection: {
      id: 'collection', name: 'CMD COLLECTION [ສັ່ງຄ່າຍຊຶ່ງ]', cat: 'FIVEM', img: 'images/products/collection.jpg', sold: 0,
      plans: [{ id: 'default', name: 'ປົກກະຕິ', price: 0, stock: 0 }],
      details: []
    },
    upcri: {
      id: 'upcri', name: 'UPCRI ປັບອົງສາຄຣີ ເຊັກບໍ່ເຈີ', cat: 'FIVEM', img: 'images/products/upcri.jpg', sold: 0,
      plans: [{ id: 'default', name: 'ປົກກະຕິ', price: 0, stock: 0 }],
      details: []
    }
  };

  const M = {
    needLogin: 'ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນສັ່ງຊື້',
    noBackend: 'ລະບົບສັ່ງຊື້ຍັງບໍ່ໄດ້ເຊື່ອມຕໍ່ ຈຶ່ງຍັງບໍ່ສາມາດສັ່ງຊື້ໄດ້ໃນຕອນນີ້',
    soldOut: 'ສິນຄ້າໝົດ',
    fail: 'ສັ່ງຊື້ບໍ່ສຳເລັດ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ',
    net: 'ເຊື່ອມຕໍ່ບໍ່ໄດ້ ກະລຸນາກວດສອບອິນເຕີເນັດແລ້ວລອງໃໝ່',
    ok: 'ສັ່ງຊື້ສຳເລັດ'
  };

  async function loadProduct(slug) {
    if (window.ExshopCatalog && typeof window.ExshopCatalog.get === 'function') return window.ExshopCatalog.get(slug);
    return Object.prototype.hasOwnProperty.call(CATALOG, slug) ? CATALOG[slug] : null;
  }

  /* ---- session: ใช้ที่เก็บเดียวกับ auth.js (localStorage → sessionStorage) เพื่ออ่านสถานะล็อกอินเดิม ----
     ค่า url / publishable key เป็นค่าเดียวกับใน auth.js (เปิดเผยในเบราว์เซอร์ได้ ความปลอดภัยอยู่ที่ RLS) */
  const SB = { url: 'https://jtrgnsfbqlywgrwtaxcc.supabase.co', key: 'sb_publishable_cWnZSRWuB4u2bV3s1KjXkg_o6sg3H5H' };
  const store = {
    getItem: k => { try { return localStorage.getItem(k) ?? sessionStorage.getItem(k); } catch (e) { return null; } },
    setItem: (k, v) => { try { (localStorage.getItem(k) !== null ? localStorage : sessionStorage).setItem(k, v); } catch (e) {} },
    removeItem: k => { try { localStorage.removeItem(k); sessionStorage.removeItem(k); } catch (e) {} }
  };
  let sb = null;
  function client() {
    if (sb || !window.supabase) return sb;
    sb = window.supabase.createClient(SB.url, SB.key, { auth: { storage: store, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } });
    return sb;
  }
  async function hasSession() {
    const c = client(); if (!c) return false;
    try { const { data } = await c.auth.getSession(); return !!(data && data.session); } catch (e) { return false; }
  }

  /* ---- render ---- */
  let product = null, plan = null, busy = false, requestId = null, msgT;
  const buy = $('btnBuy');

  function say(kind, text, keep) {
    const m = $('msg'); clearTimeout(msgT);
    if (!text) { m.classList.remove('show'); return; }
    m.dataset.k = kind; m.textContent = text; m.classList.add('show');
    if (!keep) msgT = setTimeout(() => m.classList.remove('show'), 6000);
  }

  function paint() {
    const price = plan ? plan.price : 0, left = plan ? plan.stock : 0;
    $('iPrice').textContent = NF.format(price) + ' ກີບ';
    $('sPlan').textContent = plan ? plan.name : '-';
    $('sQty').textContent = '1 ຊິ້ນ';
    $('sPrice').textContent = NF.format(price) + ' ກີບ';
    $('stock').textContent = NF.format(left);
    const out = !plan || left < 1;
    buy.disabled = out || busy;
    $('buyT').textContent = out ? M.soldOut : 'ສັ່ງຊື້ສິນຄ້າ';
  }

  function renderPlans() {
    const box = $('plans'); box.textContent = '';
    product.plans.forEach(p => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'pd-plan'; b.setAttribute('role', 'radio'); b.dataset.id = p.id;
      const out = p.stock < 1;
      if (out) b.setAttribute('aria-disabled', 'true');
      const n = document.createElement('span'); n.className = 'n'; n.textContent = p.name;
      const pr = document.createElement('span'); pr.className = 'p'; pr.textContent = '₭' + NF.format(p.price);
      const s = document.createElement('span'); s.className = 's'; s.textContent = out ? M.soldOut : 'ເຫຼືອ ' + NF.format(p.stock) + ' ຊິ້ນ';
      const c = document.createElement('span'); c.className = 'pd-chk'; c.setAttribute('aria-hidden', 'true');
      c.innerHTML = '<svg class="pd-i"><use href="#tick"/></svg>';
      b.append(n, pr, s, c);
      box.appendChild(b);
    });
    select(product.plans.find(p => p.stock > 0) || product.plans[0]);
  }

  function select(p) {
    if (!p || busy) return;
    plan = p; requestId = null; say('', '');
    $('plans').querySelectorAll('.pd-plan').forEach(b => {
      const on = b.dataset.id === p.id;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    paint();
  }

  /* ---- order ---- */
  async function order() {
    if (busy || !plan || plan.stock < 1) return;
    busy = true; buy.disabled = true; buy.setAttribute('aria-busy', 'true'); buy.classList.remove('is-err');
    $('buyT').textContent = 'ກຳລັງດຳເນີນການ…'; say('', '');
    let failed = false;
    try {
      if (!(await hasSession())) { failed = true; say('error', M.needLogin, true); return; }
      if (!window.ExshopOrder || typeof window.ExshopOrder.place !== 'function') { failed = true; say('error', M.noBackend, true); return; }
      /* requestId คงเดิมจนกว่าจะรู้ผล เพื่อให้ฝั่งเซิร์ฟเวอร์กันออเดอร์ซ้ำเมื่อกดลองใหม่ */
      if (!requestId) requestId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
      const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 20000));
      const res = await Promise.race([window.ExshopOrder.place({ requestId, productId: product.id, planId: plan.id, qty: 1 }), timeout]);
      if (res && res.ok === true) {
        if (typeof res.stock === 'number') plan.stock = Math.max(0, res.stock); else plan.stock = Math.max(0, plan.stock - 1);
        requestId = null; say('ok', res.message || M.ok, true); renderPlansKeep();
      } else { failed = true; requestId = null; say('error', (res && res.message) || M.fail, true); }
    } catch (e) {
      failed = true;
      say('error', e && e.message === 'timeout' ? M.net : M.fail, true); /* requestId เก็บไว้ ลองใหม่จะไม่สร้างออเดอร์ซ้ำ */
    } finally {
      busy = false; buy.removeAttribute('aria-busy'); paint();
      if (failed) { void buy.offsetWidth; buy.classList.add('is-err'); }
    }
  }
  function renderPlansKeep() {
    const keep = plan.id; renderPlans();
    const again = product.plans.find(p => p.id === keep); if (again && again.stock > 0) select(again);
  }

  /* ---- init ---- */
  async function init() {
    const slug = new URLSearchParams(location.search).get('p') || 'unban';
    let p = null;
    try { p = await loadProduct(slug); } catch (e) {}
    if (!p) { $('empty').hidden = false; document.title = 'ບໍ່ພົບສິນຄ້າ'; $('bcName').textContent = '-'; return; }
    product = p; document.title = p.name;
    $('bcName').textContent = p.name; $('bcCat').textContent = p.cat;
    $('hName').textContent = p.name; $('hCat').textContent = p.cat; $('iName').textContent = p.name;
    const img = $('pic'); img.alt = p.name; const frame = img.parentNode; frame.dataset.name = p.name;
    img.onerror = () => { frame.classList.add('pd-ph'); }; /* ยังไม่มีไฟล์รูป → แสดงกรอบชื่อสินค้าแทน */
    img.src = p.img;
    const ul = $('detList');
    const detCard = document.querySelector('.pd-card--det'); if (detCard && !p.details.length) detCard.hidden = true;
    p.details.forEach(t => { const li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
    $('sold').textContent = NF.format(p.sold);
    renderPlans();
    $('view').hidden = false;
  }

  $('plans').addEventListener('click', e => {
    const b = e.target.closest('.pd-plan'); if (!b || b.getAttribute('aria-disabled') === 'true') return;
    select(product.plans.find(p => p.id === b.dataset.id));
  });
  $('plans').addEventListener('keydown', e => {
    const k = e.key; if (!/^Arrow(Left|Right|Up|Down)$/.test(k)) return;
    const list = product.plans.filter(p => p.stock > 0); if (list.length < 2) return;
    e.preventDefault();
    const i = list.indexOf(plan), d = /Right|Down/.test(k) ? 1 : -1;
    const next = list[(i + d + list.length) % list.length]; select(next);
    $('plans').querySelector('[data-id="' + next.id + '"]').focus();
  });
  buy.addEventListener('click', order);
  $('btnBack').addEventListener('click', e => { if (history.length > 1 && document.referrer && new URL(document.referrer).origin === location.origin) { e.preventDefault(); history.back(); } });
  init();
})();
