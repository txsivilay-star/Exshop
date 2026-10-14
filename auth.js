/* ===== CONFIG: เชื่อม Supabase =====
   supabaseKey = publishable key (เปิดเผยในเบราว์เซอร์ได้ ความปลอดภัยอยู่ที่ RLS ในฐานข้อมูล)
   *ห้ามใส่ secret / service_role key ในไฟล์นี้เด็ดขาด
   turnstileSiteKey: Site Key ของ Cloudflare Turnstile (เว้นว่าง = ไม่แสดงช่องตรวจสอบ)
     ถ้าใส่ ต้องเปิด CAPTCHA protection ใน Supabase > Authentication > Attack Protection ด้วย
   redirect: เว้นว่าง = อยู่หน้าเดิมหลังล็อกอิน */
const AUTH = {
  supabaseUrl: 'https://jtrgnsfbqlywgrwtaxcc.supabase.co',
  supabaseKey: 'sb_publishable_cWnZSRWuB4u2bV3s1KjXkg_o6sg3H5H',
  turnstileSiteKey: '',
  redirect: '',
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
    mailReq: 'ກະລຸນາປ້ອນອີເມວ', pw: 'ກະລຸນາປ້ອນລະຫັດຜ່ານ',
    newId: 'ຊື່ຜູ້ໃຊ້ 3–20 ຕົວ (a-z, 0-9, _)', mail: 'ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ',
    newPw: 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ', match: 'ລະຫັດຜ່ານບໍ່ກົງກັນ',
    badLogin: 'ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ',
    notConfirmed: 'ກະລຸນາຢືນຢັນອີເມວກ່ອນເຂົ້າສູ່ລະບົບ (ກວດກ່ອງຈົດໝາຍຂອງທ່ານ)',
    mailTaken: 'ອີເມວນີ້ຖືກໃຊ້ສະໝັກແລ້ວ', nameTaken: 'ຊື່ຜູ້ໃຊ້ນີ້ມີຄົນໃຊ້ແລ້ວ',
    rate: 'ລອງຫຼາຍເກີນໄປ ກະລຸນາລໍຖ້າສັກຄູ່ແລ້ວລອງໃໝ່', captcha: 'ການກວດສອບບໍ່ຜ່ານ ກະລຸນາລອງໃໝ່',
    net: 'ເຊື່ອມຕໍ່ເຊີບເວີບໍ່ໄດ້ ກະລຸນາກວດອິນເຕີເນັດແລ້ວລອງໃໝ່', generic: 'ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່',
    loginOk: 'ເຂົ້າສູ່ລະບົບສຳເລັດ', regOk: 'ສະໝັກສະມາຊິກສຳເລັດ ກະລຸນາເຂົ້າສູ່ລະບົບ',
    regConfirm: 'ສະໝັກສຳເລັດ! ກະລຸນາຢືນຢັນອີເມວ (ກວດກ່ອງຈົດໝາຍ) ແລ້ວເຂົ້າສູ່ລະບົບ',
    noBackend: 'ຍັງບໍ່ໄດ້ເຊື່ອມຖານຂໍ້ມູນ ກະລຸນາລອງຣີເຟຣດໜ້າໃໝ່', googleFail: 'ເຂົ້າສູ່ລະບົບດ້ວຍ Google ບໍ່ສຳເລັດ'
  };
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const rules = {
    'l-em': v => EMAIL.test(v.trim()) ? '' : (v.trim() ? M.mail : M.mailReq),
    'l-pw': v => v ? '' : M.pw,
    'r-id': v => /^[A-Za-z0-9_]{3,20}$/.test(v.trim()) ? '' : M.newId,
    'r-em': v => EMAIL.test(v.trim()) ? '' : (v.trim() ? M.mail : M.mailReq),
    'r-pw': v => v.length >= 6 ? '' : M.newPw,
    'r-pw2': v => v && v === $('#r-pw').value ? '' : M.match
  };

  /* Supabase client: จำบัญชี = เก็บ session ใน localStorage (อยู่ข้ามการปิดเบราว์เซอร์)
     ไม่ติ๊ก = เก็บใน sessionStorage (หายเมื่อปิดแท็บ/เบราว์เซอร์) */
  const REM = 'exshop_remember', REM_EMAIL = 'exshop_email';
  const wantsRemember = () => { try { return localStorage.getItem(REM) === '1'; } catch (e) { return false; } };
  const authStorage = {
    getItem: k => { try { return localStorage.getItem(k) ?? sessionStorage.getItem(k); } catch (e) { return null; } },
    setItem: (k, v) => { try { const keep = wantsRemember(); (keep ? localStorage : sessionStorage).setItem(k, v); (keep ? sessionStorage : localStorage).removeItem(k); } catch (e) {} },
    removeItem: k => { try { localStorage.removeItem(k); sessionStorage.removeItem(k); } catch (e) {} }
  };
  const sb = window.supabase
    ? window.supabase.createClient(AUTH.supabaseUrl, AUTH.supabaseKey, { auth: { storage: authStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
    : null;

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

  /* Google: เส้นสี่สีที่แตะได้ -> Supabase OAuth (ต้องเปิด Google provider ใน Supabase Dashboard) */
  am.addEventListener('click', e => {
    const b = e.target.closest('[data-google]');
    if (!b || busy) return;
    play(b);
    if (!sb) { say('error', M.noBackend); return; }
    const cb = $('#l-rem', b.closest('.am-panel'));
    try { if (cb) localStorage.setItem(REM, cb.checked ? '1' : '0'); } catch (err) {}
    setTimeout(async () => {
      const { error } = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: AUTH.redirect || (location.origin + location.pathname) } });
      if (error) say('error', M.googleFail);
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

  /* ===== ส่งข้อมูลไป Supabase ===== */
  const withTimeout = p => Promise.race([p, new Promise((_, no) => setTimeout(() => no(new Error('timeout')), AUTH.timeoutMs))]);
  function mapError(err) {
    const m = String((err && (err.code || err.message)) || err || '').toLowerCase();
    if (m.includes('invalid_credentials') || m.includes('invalid login')) return M.badLogin;
    if (m.includes('email_not_confirmed') || m.includes('not confirmed')) return M.notConfirmed;
    if (m.includes('user_already_exists') || m.includes('already registered')) return M.mailTaken;
    if (m.includes('database error saving new user')) return M.nameTaken;
    if (m.includes('rate') && m.includes('limit')) return M.rate;
    if (m.includes('captcha')) return M.captcha;
    if (m.includes('weak_password') || m.includes('password')) return M.newPw;
    if (m.includes('timeout') || m.includes('fetch') || m.includes('network')) return M.net;
    return M.generic;
  }
  async function doLogin(d) {
    try {
      localStorage.setItem(REM, d.remember ? '1' : '0');
      if (d.remember) localStorage.setItem(REM_EMAIL, d.email); else localStorage.removeItem(REM_EMAIL);
    } catch (e) {}
    const { error } = await withTimeout(sb.auth.signInWithPassword({
      email: d.email, password: d.password, options: d.token ? { captchaToken: d.token } : undefined }));
    return error ? { ok: false, message: mapError(error) } : { ok: true };
  }
  async function doRegister(d) {
    const chk = await withTimeout(sb.rpc('username_available', { p_username: d.username }));
    if (chk.error) return { ok: false, message: mapError(chk.error) };
    if (chk.data === false) return { ok: false, message: M.nameTaken };
    const { data, error } = await withTimeout(sb.auth.signUp({
      email: d.email, password: d.password,
      options: { data: { username: d.username }, emailRedirectTo: location.origin + location.pathname, captchaToken: d.token || undefined } }));
    if (error) return { ok: false, message: mapError(error) };
    /* เปิด confirm email + อีเมลซ้ำ: Supabase คืน user ที่ identities ว่าง (ไม่ error เพื่อกันเดาอีเมล) */
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) return { ok: false, message: M.mailTaken };
    const needConfirm = !data.session;
    if (data.session) { try { await sb.auth.signOut(); } catch (e) {} } /* ให้กลับมาล็อกอินเอง */
    return { ok: true, needConfirm };
  }

  $$('form', am).forEach(form => form.addEventListener('submit', async e => {
    e.preventDefault();
    const kind = form.dataset.form, btn = $('.go', form);
    if (busy || btn.disabled) return;
    const inputs = $$('.inp input', form), bad = inputs.filter(i => !check(i));
    if (bad.length) { bad[0].focus(); return; }
    if (!sb) { say('error', M.noBackend); return; }
    busy = true; btn.classList.add('busy'); btn.setAttribute('aria-busy', 'true');
    const v = n => form.elements[n].value;
    let done = false;
    try {
      if (kind === 'login') {
        const r = await doLogin({ email: v('email').trim(), password: v('password'), remember: form.elements.remember.checked, token: tokens.login });
        if (r.ok) {
          say('success', M.loginOk); done = true;
          setTimeout(() => {
            if (AUTH.redirect) { location.href = AUTH.redirect; return; }
            form.elements.password.value = ''; closeAuth();
            busy = false; btn.classList.remove('busy'); btn.removeAttribute('aria-busy'); resetTs('login');
          }, 800);
        } else say('error', r.message);
      } else {
        const email = v('email').trim();
        const r = await doRegister({ username: v('username').trim(), email, password: v('password'), token: tokens.register });
        if (r.ok) {
          form.reset();
          $$('.eye[aria-pressed="true"]', form).forEach(b => b.click());
          $$('.field.bad', form).forEach(f => f.classList.remove('bad'));
          /* สมัครเสร็จ -> เด้งไปแท็บเข้าสู่ระบบ พร้อมใส่อีเมลให้ */
          show('login'); $('#l-em').value = email;
          say('success', r.needConfirm ? M.regConfirm : M.regOk);
          setTimeout(() => $('#l-pw').focus({ preventScroll: true }), 350);
        } else say('error', r.message);
      }
    } catch (err) { say('error', mapError(err)); }
    if (done) return; /* คงสถานะโหลดไว้จนกว่าจะปิดหน้าต่าง */
    busy = false; btn.classList.remove('busy'); btn.removeAttribute('aria-busy'); resetTs(kind);
  }));

  /* ===== สถานะล็อกอินที่หัวเว็บ + ออกจากระบบ ===== */
  const slots = $$('.hb-login, .hb-reg, .dr-f .l, .dr-f .r').map(el => ({ el, html: el.innerHTML, route: el.dataset.route }));
  function setHeader(name) {
    slots.forEach(({ el, html, route }) => {
      if (name == null) {
        el.innerHTML = html; el.dataset.route = route; el.removeAttribute('data-logout');
        el.classList.remove('hb-who', 'hb-out'); return;
      }
      el.removeAttribute('data-route');
      if (route === 'login') {
        el.innerHTML = '<svg class="i"><use href="#user"/></svg><span class="who-n"></span>';
        $('.who-n', el).textContent = name; el.classList.add('hb-who');
      } else {
        el.innerHTML = '<svg class="i"><use href="#logout"/></svg>ອອກຈາກລະບົບ';
        el.setAttribute('data-logout', ''); el.classList.add('hb-out');
      }
    });
  }
  let shown = null;
  async function syncUser(user) {
    if (!user) { shown = null; setHeader(null); return; }
    if (shown === user.id) return;
    shown = user.id;
    setHeader((user.user_metadata && user.user_metadata.username) || (user.email || '').split('@')[0]);
    try {
      const { data } = await sb.from('profiles').select('username').eq('id', user.id).maybeSingle();
      if (data && data.username && shown === user.id) setHeader(data.username);
    } catch (e) {}
  }
  if (sb) {
    /* อย่า await เรียก supabase ใน callback นี้โดยตรง (กัน deadlock) จึงใช้ setTimeout */
    sb.auth.onAuthStateChange((ev, session) => setTimeout(() => syncUser(session && session.user), 0));
  }
  document.addEventListener('click', e => {
    if (!sb || !e.target.closest('[data-logout]')) return;
    e.preventDefault();
    if (typeof closeMenu === 'function') closeMenu();
    sb.auth.signOut();
  });

  /* จำบัญชี: ใส่อีเมลที่เคยจำไว้ และติ๊กตามที่เลือกครั้งก่อน */
  try {
    const re = localStorage.getItem(REM_EMAIL);
    if (re) $('#l-em').value = re;
    $('#l-rem').checked = localStorage.getItem(REM) === '1';
  } catch (e) {}
})();
