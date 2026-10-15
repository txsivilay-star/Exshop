/* ===== CONFIG: เปลี่ยนชื่อร้าน ลิงก์ และข้อมูลตรงนี้ ===== */
const CONFIG = {
  announce: 'ຊື້ສິນຄ້າສຳເລັດແລ້ວເຂົ້າ Discord ຂອງທາງຮ້ານນຳເດີ້!',
  routes: { // ใส่ URL จริง ถ้าเว้นว่างจะขึ้นข้อความแจ้งเตือนแทน
    login:'', register:'', topup:'', orders:'', hwid:'', chat:''
  },
  onBuy(p){
    if(p.art){ location.href = 'product.html?p=' + encodeURIComponent(p.art); return; } /* ทุกสินค้ามีหน้าสั่งซื้อ */
    snack('ສັ່ງຊື້ ' + p.n + ' — ເຊື່ອມລະບົບຊຳລະເງິນທີ່ CONFIG.onBuy');
  }
};

/* เປິດ/ປິດการแสดงผล: true = แสดง, false = ซ่อน (ข้อมูลยังอยู่ครบ) */
const SHOW = { categories:true, products:true, featured:false };

const $ = (s, r=document) => r.querySelector(s);
const ic = (id, cls='') => `<svg class="i ${cls}"><use href="#${id}"/></svg>`;
let snackT;
function snack(msg){ const s=$('#snack'); s.textContent=msg; s.classList.add('show'); clearTimeout(snackT); snackT=setTimeout(()=>s.classList.remove('show'),2400); }
/* คนที่ยังไม่ล็อกอิน: ดูหน้าเว็บ เลื่อน เปิดเมนู เปลี่ยนภาษา/ธีม ได้
   แต่ทุกการกระทำ (ซื้อ เติมเงิน ออเดอร์ HWID แชต) จะเด้งหน้าต่างสมัครสมาชิกทันที
   (กั้นฝั่งหน้าเว็บเพื่อ UX เท่านั้น ข้อมูลจริงต้องกันด้วย RLS ในฐานข้อมูล) */
const NEED_AUTH_MSG = 'ກະລຸນາສະໝັກສະມາຊິກ ຫຼື ເຂົ້າສູ່ລະບົບກ່ອນໃຊ້ງານ';
function requireAuth(fn){
  if(window.isAuthed && window.isAuthed()){ if(fn) fn(); return true; }
  if(window.openAuth) openAuth('register', NEED_AUTH_MSG); else snack(NEED_AUTH_MSG);
  return false;
}
function go(route){
  if(route==='login' || route==='register'){ if(window.openAuth){ openAuth(route); return; } }
  else if(!requireAuth()) return;
  const u = CONFIG.routes[route];
  if(u){ location.href = u; } else { snack('ຍັງບໍ່ໄດ້ຕັ້ງລິ້ງປາຍທາງ (CONFIG.routes.' + route + ')'); }
}
document.addEventListener('click', e => {
  const r = e.target.closest('[data-route]');
  if(r){ e.preventDefault(); closeMenu(); go(r.dataset.route); }
});


/* marquee */
(function(){
  const one = `<span class="mq-item">${ic('bell')}${CONFIG.announce}</span>`;
  $('#mq').innerHTML = (one.repeat(6)) + (one.repeat(6));
})();

/* theme */
(function(){
  const root = document.documentElement, btn = $('#btnTheme');
  const apply = t => { root.dataset.theme = t; btn.innerHTML = ic(t==='dark' ? 'moon' : 'sun'); };
  let t = 'light';
  try { t = localStorage.getItem('theme') || 'light'; } catch(e){}
  apply(t);
  btn.addEventListener('click', () => {
    t = root.dataset.theme === 'dark' ? 'light' : 'dark'; apply(t);
    try { localStorage.setItem('theme', t); } catch(e){}
  });
})();
$('#btnChat').addEventListener('click', () => go('chat'));

/* drawer */
const ov = $('#ov');
function openMenu(){ $('#btnMenu').classList.add('is-open'); ov.classList.add('open'); ov.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function closeMenu(){ $('#btnMenu').classList.remove('is-open'); ov.classList.remove('open'); ov.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
$('#btnMenu').addEventListener('click', openMenu);
$('#btnClose').addEventListener('click', closeMenu);
ov.addEventListener('click', e => { if(e.target === ov) closeMenu(); });
ov.querySelectorAll('a[href^="#"]:not([data-route])').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if(e.key==='Escape') closeMenu(); });

/* stats */
$('#stats').innerHTML = [
  ['user','ຜູ້ໃຊ້ງານ','0','ຄົນ'],
  ['box','ສິນຄ້າ','0','ລາຍການ'],
  ['trend','ຄຳສັ່ງຊື້','0','ລາຍການ'],
  ['box','ຂາຍແລ້ວ','0','ຊິ້ນ']
].map(([i,l,n,u]) => `<div class="stat"><svg class="i wm" style="stroke-width:1.2"><use href="#${i}"/></svg><div class="ic">${ic(i)}</div><div class="tx"><span class="lb">${l}</span><span class="nm">${n}<small>${u}</small></span></div></div>`).join('');

/* art helpers (placeholder artwork — replace with real images via CONFIG / <img>) */
const arts = {
  unban:{bg:'radial-gradient(90% 70% at 50% 40%,#7a1218,#2a0508 70%,#120204)', top:'<div style="position:absolute;left:24%;top:17%;width:52%;aspect-ratio:1;border:9px solid #FF0000;border-radius:50%"></div><div style="position:absolute;left:49%;top:14%;width:9px;height:58%;background:#FF0000;transform:rotate(45deg);transform-origin:50% 40%"></div>', t:[['UNBAN FIVEM','#fff','8.2cqw','66%'],['ປົດແບນບໍ່ມີໂດນຍ້ອນຫຼັງ','#fff','4.4cqw','80%']]},
  devil:{bg:'linear-gradient(160deg,#0c0d1c,#2a0a14 60%,#1a0508)', top:'<div style="position:absolute;left:12%;right:10%;top:14%;height:52%;background:linear-gradient(120deg,#25306a,#3a1c3a);clip-path:polygon(0 100%,8% 30%,25% 8%,42% 22%,55% 5%,75% 12%,90% 40%,100% 100%);opacity:.9"></div>', t:[['DEVIL STAR','#FF0000','13cqw','72%']]},
  card:{bg:'linear-gradient(180deg,#0b0e1f,#101a4a 70%,#090d28)', top:'<div style="position:absolute;left:15%;right:15%;top:20%;height:34%;background:linear-gradient(135deg,#1f2a66,#0a0f2c);border:1px solid #3d4fb0;border-radius:6px"></div>', t:[['CARD','#1d3fe0','13cqw','72%']]},
  setting:{bg:'linear-gradient(170deg,#1b0609,#3d0a10 60%,#150407)', top:'<div style="position:absolute;left:25%;right:12%;top:8%;height:60%;background:linear-gradient(180deg,#444,#111);clip-path:polygon(15% 100%,20% 25%,50% 6%,80% 25%,90% 100%);opacity:.7"></div>', t:[['SETTING PERFECTX','#FF0000','8.4cqw','74%']]},
  xlight:{bg:'linear-gradient(180deg,#14090b,#2c0a0e)', top:'<div style="position:absolute;left:18%;right:18%;top:26%;height:5px;background:linear-gradient(90deg,#555,#ccc,#555);transform:rotate(-40deg)"></div>', t:[['CMD','#fff','12cqw','56%'],['XLIGHT','#FF0000','17cqw','67%'],['SUPER MODE','#ffb21f','4.6cqw','86%']]},
  unlock:{bg:'linear-gradient(160deg,#241012,#4a0c12 70%,#190507)', top:'<div style="position:absolute;left:5%;top:12%;width:40%;height:70%;background:linear-gradient(180deg,#8d8d94,#2b2b30);border-radius:40% 40% 0 0"></div><div style="position:absolute;right:6%;top:10%;font-style:italic;color:#ffc425;font-size:8cqw;font-weight:900;transform:rotate(-8deg);line-height:.95;text-align:right">STAR<br><span style="font-size:5cqw">COMMUNITY</span></div>', t:[['ປົດລັອກສະກິນ','#FF0000','14cqw','73%']]},
  collection:{bg:'linear-gradient(160deg,#3a0a10,#14090c)', top:'<div style="position:absolute;left:10%;top:16%;width:34%;height:52%;background:linear-gradient(180deg,#9a7a70,#2a1a1a);border-radius:40% 40% 8% 8%"></div>', t:[['COLLECTION','#fff','11.5cqw','72%']]},
  upcri:{bg:'linear-gradient(160deg,#4a0a10,#0d0709 65%)', top:'<div style="position:absolute;left:18%;right:18%;top:36%;height:30%;background:linear-gradient(135deg,#2b2b30,#0a0a0c);border:1px solid #555;border-radius:6px;transform:rotate(-4deg)"></div>', t:[['UPCRI','#fff','20cqw','8%'],['ຄຣີປັບໄດ້ ຄຣີໜ້າ ຄຣີຂ້າງ ຄຣີຫຼັງ','#fff','4.5cqw','86%']]},
  phantom:{bg:'linear-gradient(160deg,#222,#050505)', top:'', t:[['PHANTOM','#ddd','9cqw','38%']]},
  zent:{bg:'linear-gradient(160deg,#5b2bd8,#14062e)', top:'', t:[['ZENTNITYX','#e9dcff','7cqw','42%']]},
  level:{bg:'linear-gradient(160deg,#6f3bd0,#1c0a3f)', top:'', t:[['LEVEL?','#fff','11cqw','40%']]},
  br:{bg:'linear-gradient(120deg,#0d0d0f,#3a1208 70%,#15090a)', top:'', t:[]}
};
function artSq(key){
  const a = arts[key];
  const tx = a.t.map(([t,c,s,y]) => `<div class="tp" style="color:${c};font-size:${s};top:${y};text-shadow:0 2px 6px rgba(0,0,0,.6)">${t}</div>`).join('');
  return `<div style="position:absolute;inset:0;container-type:inline-size;background:${a.bg}">${a.top}${tx}</div>`;
}

function prodImg(p){
  const src = p.img || `images/products/${p.art}.jpg`;
  return `<img class="pic" src="${src}" alt="${p.n.replace(/"/g,'&quot;')}" loading="lazy" onerror="this.outerHTML=artSq('${p.art}')">`;
}

/* products */
const products = [
  {n:'UNBAN FIVEM', p:'₭0', left:'0', sold:'0', art:'unban', cat:'fivem'},
  {n:'DEVIL STAR', p:'₭0', left:'0', sold:'0', art:'devil', cat:'fivem'},
  {n:'CARD (ຄ່າຍຂາວ)', p:'₭0', left:'0', sold:'0', art:'card', cat:'fivem'},
  {n:'SETTING PERFECTX', p:'₭0', left:'0', sold:'0', art:'setting', cat:'fivem'},
  {n:'CMD XLIGHT', p:'₭0', left:'0', sold:'0', art:'xlight', cat:'fivem'},
  {n:'UnlockSkin (Starcommu) ບໍ່ຕ້ອງເຕີມຊື້ສະກິນ', p:'₭0', left:'0', sold:'0', art:'unlock', cat:'fivem'},
  {n:'CMD COLLECTION [ສັ່ງຄ່າຍຊຶ່ງ]', p:'₭0', left:'0', sold:'0', art:'collection', cat:'fivem'},
  {n:'UPCRI ປັບອົງສາຄຣີ ເຊັກບໍ່ເຈີ', p:'₭0', left:'0', sold:'0', art:'upcri', cat:'fivem'}
];
function renderProducts(cat){
  const list = products.filter(p => p.cat === cat);
  $('#grid').innerHTML = list.length ? list.map((p,i) => `
    <article class="pc">
      <div class="pimg">${prodImg(p)}</div>
      <div class="pb">
        <h3 class="pn">${p.n}</h3>
        <div class="pinfo"><div class="pr"><span class="pl"><span class="now">${p.p}</span></span><span class="left">ເຫຼືອ ${p.left} ຊິ້ນ</span></div></div>
        <button class="buy" data-buy="${i}">${ic('cart')}ຊື້ເລີຍ</button>
        <div class="sold">${ic('flame')}ຂາຍໄປແລ້ວ ${p.sold} ຊິ້ນ</div>
      </div>
    </article>`).join('') : `<div class="empty">ຍັງບໍ່ມີສິນຄ້າໃນໝວດນີ້</div>`;
  $('#grid').querySelectorAll('[data-buy]').forEach(b => b.addEventListener('click', () => requireAuth(() => CONFIG.onBuy(list[+b.dataset.buy]))));
  /* กดที่ชื่อ/รูป/การ์ด ของสินค้าที่มีหน้าสั่งซื้อ → เปิดหน้าสินค้าทันที (ปุ่มซื้อยังทำงานตามเดิม) */
  $('#grid').querySelectorAll('.pc').forEach((card, i) => {
    const p = list[i]; if(!p || !p.art) return;
    const open = () => { location.href = 'product.html?p=' + p.art; };
    card.classList.add('is-link'); card.tabIndex = 0; card.setAttribute('role', 'link'); card.setAttribute('aria-label', p.n);
    card.addEventListener('click', e => { if(!e.target.closest('[data-buy]')) open(); });
    card.addEventListener('keydown', e => { if((e.key === 'Enter' || e.key === ' ') && e.target === card){ e.preventDefault(); open(); } });
  });
}
renderProducts('fivem');

/* featured carousel */
const feat = [
  {n:'UNBAN FIVEM', p:'₭0', art:'unban'}, {n:'DEVIL STAR', p:'₭0', art:'devil'},
  {n:'BR MODS', p:'₭0', art:'br'}, {n:'PHANTOM (AD+IOS)', p:'₭0', art:'phantom'},
  {n:'ZENTNITYX (AD+IOS)', p:'₭0', art:'zent'}, {n:'CMD XLIGHT', p:'₭0', art:'xlight'}
];
(function(){
  const tr = $('#featTrack'), dots = $('#featDots');
  tr.innerHTML = feat.map(f => `<a class="fcard" href="#products"><div class="fi">${artSq(f.art)}</div><div class="fn">${f.n}</div><div class="fp">${f.p}</div></a>`).join('');
  dots.innerHTML = feat.map((_,i) => `<button aria-label="ສະໄລດ໌ ${i+1}"></button>`).join('');
  let i = 0, timer;
  const set = n => { i = (n + feat.length) % feat.length; tr.style.transform = `translateX(-${i*100}%)`; [...dots.children].forEach((d,k) => d.classList.toggle('on', k===i)); };
  const start = () => { clearInterval(timer); timer = setInterval(() => set(i+1), 3500); };
  [...dots.children].forEach((d,k) => d.addEventListener('click', () => { set(k); start(); }));
  set(0); start();
})();

/* categories */
const cats = [
  {k:'fivem', t1:'FIVEM GAME', n:'FIVEM', d:'ໂປຣແກຣມຊ່ວຍຫຼິ້ນ Fivem', c:0},
  {k:'cheat', t1:'CHEAT', n:'CHEAT', d:'ໂປຣແກຣມຊ່ວຍຫຼິ້ນ', c:0},
  {k:'random', t1:'RANDOM ID', n:'RANDOM ID', d:'ສຸ່ມໄອດີເກມ', c:0},
  {k:'freefire', t1:'FREE FIRE', n:'FREE FIRE', d:'ໂປຣແກຣມຊ່ວຍຫຼິ້ນ Free Fire', c:0}
];
$('#catList').innerHTML = cats.map(c => `
  <button class="cat" data-cat="${c.k}">
    <div class="cb"><img class="cimg" src="${c.img || 'images/categories/' + c.k + '.jpg'}" alt="${c.n}" loading="lazy" onerror="this.parentNode.classList.add('noimg');this.remove()"><span class="art"></span><span class="t1">${c.t1}</span><span class="t2">PRODUCT</span>
      <span class="tg"><i>GAME ONLINE</i><i>CHEAT GAME</i><i>SOCIAL HUB</i><i>UNBAN SERVICE</i></span>
      <span class="cl">CLICK HERE!</span><span class="ln"></span></div>
    <div class="cat-b"><div><h3>${c.n}</h3><p>${c.d}</p></div><span class="cnt">${c.c} ສິນຄ້າ</span></div>
  </button>`).join('');
$('#catList').addEventListener('click', e => {
  const b = e.target.closest('[data-cat]'); if(!b) return;
  const c = cats.find(x => x.k === b.dataset.cat);
  $('#catName').textContent = c.n; renderProducts(c.k);
  $('#products').scrollIntoView({behavior:'smooth'});
});
$('#allBtn').addEventListener('click', () => { $('#catName').textContent = 'FIVEM'; renderProducts('fivem'); });

/* apply show/hide flags */
$('#cats').hidden = !SHOW.categories;
$('#products').hidden = !SHOW.products;
$('#featSec').hidden = !SHOW.featured;
