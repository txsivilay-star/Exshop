/* ===== CONFIG: เชื่อมระบบหลังบ้านตรงนี้ =====
   endpoints: URL จริงของ API (POST JSON) ถ้าเว้นว่าง = โหมดทดลอง ไม่ล็อกอิน/สมัครจริง
   login ส่ง { username, password, turnstileToken }
   register ส่ง { username, email, password, turnstileToken }
   สำเร็จ = HTTP 2xx, ล้มเหลว = HTTP อื่น + { message }
   turnstileSiteKey: Site Key ของ Cloudflare Turnstile (เว้นว่าง = ไม่แสดงช่องตรวจสอบ)
   *ต้องตรวจ token ฝั่งเซิร์ฟเวอร์ด้วย Secret Key เสมอ */
const AUTH = {
  endpoints: { login: '', register: '' },
  turnstileSiteKey: '',
  googleUrl: '',           // URL เริ่ม Google OAuth ฝั่งเซิร์ฟเวอร์ เช่น '/auth/google' (เว้นว่าง = โหมดทดลอง)
  redirect: '',            // เว้นว่าง = รีโหลดหน้าปัจจุบัน
  timeoutMs: 15000
};

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const am = $('#am'), tabs = $('.am-tabs'), toast = $('#atoast'), app = $('#top');
  const panels = { login: $('#p-login'), register: $('#p-register') };
  let toastT, view = '', busy = false, lastFocus = null;
  const soon = $('#soon');
  const tokens = { login: '', register: '' }, tsId = {};

  const M = {
    id: 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້', pw: 'ກະລຸນາປ້ອນລະຫັດຜ່ານ',
    newId: 'ຊື່ຜູ້ໃຊ້ 3–20 ຕົວ (a-z, 0-9, _)', mail: 'ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ',
    newPw: 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ', match: 'ລະຫັດຜ່ານບໍ່ກົງກັນ'
  };
  const rules = {
    'l-id': v => v.trim() ? '' : M.id,
    'l-pw': v => v ? '' : M.pw,
    'r-id': v => /^[A-Za-z0-9_]{3,20}$/.test(v.trim()) ? '' : M.newId,
    'r-em': v => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : M.mail,
    'r-pw': v => v.length >= 6 ? '' : M.newPw,
    'r-pw2': v => v && v === $('#r-pw').value ? '' : M.match
  };

  function say(kind, text) {
    toast.dataset.kind = kind;
    $('use', toast).setAttribute('href', '#' + (kind === 'error' ? 'alert' : kind === 'success' ? 'check' : 'info'));
    $('span', toast).textContent = text;
    toast.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove('show'), 6000);
  }

  /* Cloudflare Turnstile (โหลดเฉพาะเมื่อมี site key) */
  let tsLoad;
  const loadTs = () => tsLoad || (tsLoad = new Promise((ok, no) => {
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true; s.onload = ok; s.onerror = no; document.head.appendChild(s);
  }));
  function sync(kind) {
    $('.go', panels[kind]).disabled = !!AUTH.turnstileSiteKey && !tokens[kind];
  }
  function mountTs(kind) {
    if (!AUTH.turnstileSiteKey || tsId[kind] != null) return;
    tsId[kind] = -1;
    loadTs().then(() => {
      tsId[kind] = turnstile.render('#ts-' + kind, {
        sitekey: AUTH.turnstileSiteKey, theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
        callback: t => { tokens[kind] = t; sync(kind); },
        'expired-callback': () => { tokens[kind] = ''; sync(kind); },
        'error-callback': () => { tokens[kind] = ''; sync(kind); }
      });
    }).catch(() => { tsId[kind] = null; say('error', 'ໂຫຼດການກວດສອບ Cloudflare ບໍ່ສຳເລັດ ລອງຣີເຟຣດໜ້າໃໝ່'); });
  }
  function resetTs(kind) {
    if (!AUTH.turnstileSiteKey || !(tsId[kind] >= 0)) return;
    tokens[kind] = ''; sync(kind); try { turnstile.reset(tsId[kind]); } catch (e) {}
  }

  /* สลับแท็บ */
  function show(v) {
    if (!panels[v]) v = 'login';
    if (v === view) return;
    view = v; tabs.dataset.view = v;
    for (const k in panels) {
      const on = k === v;
      panels[k].classList.toggle('on', on);
      panels[k].inert = !on;
      const t = $('#tab-' + k);
      t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
    }
    toast.classList.remove('show');
    mountTs(v); sync(v);
  }
  tabs.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const n = view === 'login' ? 'register' : 'login'; show(n); $('#tab-' + n).focus();
    }
  });
  am.addEventListener('click', e => {
    const b = e.target.closest('[data-view]');
    if (b) { show(b.dataset.view); if (b.classList.contains('am-tab')) b.focus({ preventScroll: true }); }
  });

  /* เປິດ/ປິດ (เรียกจาก go() ใน script.js) */
  window.openAuth = function (v) {
    lastFocus = document.activeElement;
    show(v || 'login');
    am.inert = false; am.setAttribute('aria-hidden', 'false');
    app.inert = true; am.classList.add('open'); am.scrollTop = 0;
    setTimeout(() => $('#tab-' + view).focus({ preventScroll: true }), 50);
  };
  function closeAuth() {
    am.classList.remove('open'); am.inert = true; am.setAttribute('aria-hidden', 'true');
    app.inert = false; toast.classList.remove('show');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  $('#amClose').addEventListener('click', closeAuth);
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (soon.classList.contains('open')) closeSoon();
    else if (am.classList.contains('open')) closeAuth();
  });

  /* ช่องกรอก */
  function check(input) {
    const msg = rules[input.id](input.value), f = input.closest('.field');
    f.classList.toggle('bad', !!msg); $('.err', f).textContent = msg;
    input.setAttribute('aria-invalid', !!msg);
    return !msg;
  }
  $$('.inp input').forEach(inp => {
    inp.addEventListener('blur', () => { if (inp.value) check(inp); });
    inp.addEventListener('input', () => {
      if (inp.closest('.field').classList.contains('bad')) check(inp);
      if (inp.id === 'r-pw' && $('#r-pw2').value) check($('#r-pw2'));
    });
    inp.addEventListener('focus', () => setTimeout(() => inp.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300));
  });
  $$('.eye').forEach(b => {
    b.addEventListener('mousedown', e => e.preventDefault());
    b.addEventListener('click', () => {
      const inp = $('input', b.parentNode), on = inp.type === 'password';
      inp.type = on ? 'text' : 'password';
      b.setAttribute('aria-pressed', on);
      b.setAttribute('aria-label', on ? 'ເຊື່ອງລະຫັດຜ່ານ' : 'ສະແດງລະຫັດຜ່ານ');
      $('use', b).setAttribute('href', on ? '#eye-off' : '#eye');
    });
  });

  /* กดแล้วเล่นแอนิเมชันให้ครบ (ไม่ย้อนกลับทันทีเมื่อปล่อยนิ้ว) */
  function play(b) { b.classList.remove('play'); void b.offsetWidth; b.classList.add('play'); setTimeout(() => b.classList.remove('play'), 950); }

  /* Google: ไม่ใช้ปุ่ม แต่เป็นเส้นสี่สีที่แตะได้ (OAuth ต้องทำฝั่งเซิร์ฟเวอร์) */
  am.addEventListener('click', e => {
    const b = e.target.closest('[data-google]');
    if (!b || busy) return;
    play(b);
    setTimeout(() => {
      if (AUTH.googleUrl) location.href = AUTH.googleUrl;
      else say('info', 'ໂໝດທົດລອງ: ຍັງບໍ່ໄດ້ເຊື່ອມ Google Sign-In ຈຶ່ງຍັງບໍ່ໄດ້ເຂົ້າສູ່ລະບົບ');
    }, 450);
  });

  /* Discord: ยังไม่เປິດใช้ แสดงแผงแจ้งสถานะ */
  let soonFocus = null;
  function openSoon() {
    soonFocus = document.activeElement;
    soon.inert = false; soon.setAttribute('aria-hidden', 'false'); am.inert = true;
    soon.classList.add('open');
    setTimeout(() => $('.soon-ok', soon).focus({ preventScroll: true }), 60);
  }
  function closeSoon() {
    soon.classList.remove('open'); soon.inert = true; soon.setAttribute('aria-hidden', 'true'); am.inert = false;
    if (soonFocus && soonFocus.focus) soonFocus.focus({ preventScroll: true });
  }
  am.addEventListener('click', e => {
    const b = e.target.closest('[data-discord]');
    if (!b || busy) return;
    play(b); setTimeout(openSoon, 450);
  });
  soon.addEventListener('click', e => { if (e.target.closest('[data-soon-close]')) closeSoon(); });

  /* ส่งข้อมูล */
  async function send(kind, data) {
    const url = AUTH.endpoints[kind];
    if (!url) { await new Promise(r => setTimeout(r, 800)); return { demo: true }; }
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), AUTH.timeoutMs);
    try {
      const res = await fetch(url, { method: 'POST', credentials: 'same-origin', signal: ctl.signal,
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      let body = {}; try { body = await res.json(); } catch (e) {}
      return { ok: res.ok, message: body && body.message };
    } finally { clearTimeout(t); }
  }
  $$('form', am).forEach(form => form.addEventListener('submit', async e => {
    e.preventDefault();
    const kind = form.dataset.form, btn = $('.go', form);
    if (busy || btn.disabled) return;
    const inputs = $$('.inp input', form), bad = inputs.filter(i => !check(i));
    if (bad.length) { bad[0].focus(); return; }
    busy = true; btn.classList.add('busy'); btn.setAttribute('aria-busy', 'true');
    const v = n => form.elements[n].value;
    const data = kind === 'login'
      ? { username: v('username').trim(), password: v('password') }
      : { username: v('username').trim(), email: v('email').trim(), password: v('password') };
    data.turnstileToken = tokens[kind];
    let done = false;
    try {
      const r = await send(kind, data);
      if (r.demo) {
        say('info', 'ໂໝດທົດລອງ: ຂໍ້ມູນຖືກຮູບແບບ ແຕ່ຍັງບໍ່ໄດ້ເຊື່ອມລະບົບຫຼັງບ້ານ ຈຶ່ງຍັງ' + (kind === 'login' ? 'ບໍ່ໄດ້ເຂົ້າສູ່ລະບົບ' : 'ບໍ່ໄດ້ສ້າງບັນຊີ'));
      } else if (r.ok) {
        say('success', kind === 'login' ? 'ເຂົ້າສູ່ລະບົບສຳເລັດ' : 'ສະໝັກສະມາຊິກສຳເລັດ');
        done = true;
        setTimeout(() => { AUTH.redirect ? (location.href = AUTH.redirect) : location.reload(); }, 900);
      } else {
        say('error', r.message || (kind === 'login' ? 'ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ' : 'ສະໝັກບໍ່ສຳເລັດ ກະລຸນາລອງໃໝ່'));
      }
    } catch (err) {
      say('error', 'ເຊື່ອມຕໍ່ເຊີບເວີບໍ່ໄດ້ ກະລຸນາກວດອິນເຕີເນັດແລ້ວລອງໃໝ່');
    }
    if (done) return; /* คงสถานะโหลดไว้ระหว่างเปลี่ยนหน้า */
    busy = false; btn.classList.remove('busy'); btn.removeAttribute('aria-busy'); resetTs(kind);
  }));
})();
