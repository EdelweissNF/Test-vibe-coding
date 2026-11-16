/* ═══════════════════════════════════════════════
   PRISMA — app.js  (vanilla, tanpa dependensi)
   ═══════════════════════════════════════════════ */
'use strict';
(() => {

/* ── Helper ── */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const clamp = (v,a,b) => Math.min(b, Math.max(a, v));
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmtDate = ts => new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(ts));
function hash(str){ let h = 2166136261; for (let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry32(a){ return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const store = {
  get(k,f){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; }catch(e){ return f; } },
  set(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};
const scrollToEl = el => el.scrollIntoView({behavior: RM ? 'auto' : 'smooth', block:'start'});

/* ── Ikon ── */
const ICONS = {
  play:'<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
  spark:'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" fill="currentColor" stroke="none"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" fill="currentColor" stroke="none"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  back:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
  download:'<path d="M12 4v10M7 10l5 5 5-5M5 19h14"/>',
  copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5h10"/>',
  refresh:'<path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v5h-5"/>',
  trash:'<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
  eye:'<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  check:'<path d="M5 13l4 4L19 7"/>',
  sprout:'<path d="M12 20v-8"/><path d="M12 12c0-4 3-6 7-6 0 4-3 6-7 6z"/><path d="M12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5z"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="M15 9l-2 5-4 1 2-5z" fill="currentColor" stroke="none"/>',
  wind:'<path d="M3 8h10a2.5 2.5 0 1 0-2.5-2.5M3 12h15a2.5 2.5 0 1 1-2.5 2.5M3 16h7a2 2 0 1 1-2 2"/>',
  flame:'<path d="M12 3c1 3 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3.5 2-5 .5 1.5 1.5 2 3 2-1-2-1-4 0-6z"/>',
  mountain:'<path d="M3 18L9 8l4 6 3-4 5 8z"/>',
  wave:'<path d="M2 10c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 16c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M12 11v5"/>',
  warn:'<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17h.01"/>',
  chat:'<path d="M4 5h16v11H9l-5 4z"/>',
  bars:'<path d="M5 20V10M12 20V4M19 20v-7"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>'
};
const icon = (n,s=18) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||''}</svg>`;

/* ── Data: sumbu ── */
const AXES = [
  { label:'Arah Energi',    L:{l:'E',name:'Ekstrover', h:38},  R:{l:'I',name:'Introver', h:228} },
  { label:'Lensa Informasi',L:{l:'N',name:'Intuitif',  h:288}, R:{l:'S',name:'Observan', h:168} },
  { label:'Nada Keputusan', L:{l:'T',name:'Rasional',  h:205}, R:{l:'F',name:'Empatik',  h:330} },
  { label:'Ritme Hidup',    L:{l:'J',name:'Terencana', h:152}, R:{l:'P',name:'Spontan',  h:24}  }
];

/* ── Data: 40 pertanyaan (10 per sumbu, arah campuran) ── */
const QUESTIONS = [
  {t:'Setelah seharian beraktivitas, aku merasa pulih saat berkumpul dengan orang lain.',a:0,d:1},
  {t:'Aku butuh waktu sendirian yang cukup lama untuk mengisi ulang energiku.',a:0,d:-1},
  {t:'Di acara baru, aku mudah memulai percakapan dengan orang yang belum kukenal.',a:0,d:1},
  {t:'Aku lebih suka percakapan mendalam berdua daripada ramai-ramai.',a:0,d:-1},
  {t:'Aku sering berpikir sambil berbicara — ideku justru muncul saat diucapkan.',a:0,d:1},
  {t:'Aku menyusun pikiranku dulu di kepala sebelum menyampaikannya.',a:0,d:-1},
  {t:'Ponselku ramai oleh chat dan ajakan, dan aku menikmatinya.',a:0,d:1},
  {t:'Akhir pekan idealku adalah rumah, hobi, dan notifikasi yang kusenyapkan.',a:0,d:-1},
  {t:'Aku bersemangat ketika menjadi pusat perhatian di sebuah ruangan.',a:0,d:1},
  {t:'Aku lebih sering mendengarkan daripada mendominasi percakapan.',a:0,d:-1},
  {t:'Aku sering membayangkan kemungkinan “bagaimana jika” daripada fokus pada yang sudah ada.',a:1,d:1},
  {t:'Aku percaya pada detail yang bisa dilihat, disentuh, dan dibuktikan.',a:1,d:-1},
  {t:'Pola dan makna tersembunyi lebih menarik bagiku daripada fakta di permukaan.',a:1,d:1},
  {t:'Aku lebih nyaman dengan instruksi langkah demi langkah yang jelas.',a:1,d:-1},
  {t:'Pikiranku sering melompat ke masa depan dan ide-ide yang belum terwujud.',a:1,d:1},
  {t:'Aku mengandalkan pengalaman yang sudah terbukti saat menghadapi masalah.',a:1,d:-1},
  {t:'Metafora dan simbol membuatku lebih cepat paham daripada angka mentah.',a:1,d:1},
  {t:'Aku memperhatikan detail kecil yang orang lain lewatkan — warna, tekstur, bunyi.',a:1,d:-1},
  {t:'Aku senang membicarakan teori, meski belum ada gunanya saat ini.',a:1,d:1},
  {t:'Bagiku yang penting adalah apa yang bisa dikerjakan hari ini, bukan nanti.',a:1,d:-1},
  {t:'Saat mengambil keputusan besar, logika lebih dulu bicara daripada perasaan.',a:2,d:1},
  {t:'Aku mudah ikut merasakan emosi orang lain, bahkan tanpa mereka bercerita.',a:2,d:-1},
  {t:'Kritik yang jujur lebih berharga daripada pujian yang menyenangkan.',a:2,d:1},
  {t:'Menjaga perasaan orang lain sering kali lebih penting daripada memenangkan argumen.',a:2,d:-1},
  {t:'Aku bisa tetap objektif meski keputusan itu tidak populer.',a:2,d:1},
  {t:'Aku mempertimbangkan dampak emosional ke semua orang sebelum memutuskan.',a:2,d:-1},
  {t:'Keadilan berarti aturan yang sama untuk semua, tanpa pengecualian.',a:2,d:1},
  {t:'Keadilan berarti memahami konteks dan kebutuhan tiap orang.',a:2,d:-1},
  {t:'Dalam debat, aku menikmati menguji argumen dengan tajam.',a:2,d:1},
  {t:'Aku menghindari konflik dan berusaha menjadi penengah.',a:2,d:-1},
  {t:'Daftar tugas dan jadwal membuatku merasa tenang.',a:3,d:1},
  {t:'Aku lebih produktif saat dibiarkan mengalir tanpa rencana kaku.',a:3,d:-1},
  {t:'Aku menyelesaikan pekerjaan jauh sebelum tenggat.',a:3,d:1},
  {t:'Tenggat yang mepet justru memicu ide dan energiku.',a:3,d:-1},
  {t:'Liburan yang menyenangkan adalah liburan dengan itinerary yang jelas.',a:3,d:1},
  {t:'Aku suka membiarkan rencana terbuka untuk kejutan di menit terakhir.',a:3,d:-1},
  {t:'Meja dan file-ku tertata — semuanya punya tempatnya.',a:3,d:1},
  {t:'Aku nyaman dengan sedikit kekacauan; dari situ kreativitas muncul.',a:3,d:-1},
  {t:'Keputusan yang sudah dibuat memberiku kelegaan — urusan selesai.',a:3,d:1},
  {t:'Aku suka menunda keputusan agar tetap punya banyak pilihan.',a:3,d:-1}
];

/* ── Data: 16 arketipe ── */
const TEMPS = {
  udara:{name:'Udara', sub:'Gagasan & strategi', ic:'wind',     h:210},
  api:  {name:'Api',   sub:'Makna & manusia',    ic:'flame',    h:20},
  tanah:{name:'Tanah', sub:'Ketertiban & andal', ic:'mountain', h:150},
  air:  {name:'Air',   sub:'Pengalaman & aksi',  ic:'wave',     h:190}
};
const ARCH = {
  INTJ:{name:'Sang Arsitek',  h:262, tag:'Strategis, mandiri, selangkah di depan.', desc:'Kamu melihat hidup sebagai papan catur: setiap langkah punya alasan dan arah. Visi jangka panjangmu tajam, dan kamu lebih percaya sistem yang kamu rancang sendiri daripada keramaian opini.', str:['Visi jangka panjang','Berpikir sistematis','Mandiri & tegas'], grow:['Melibatkan orang lain lebih awal','Menerima “cukup baik”'], car:['Arsitek sistem','Peneliti','Perencana strategi'], match:['ENFP','ENTP']},
  INTP:{name:'Sang Pemikir',  h:205, tag:'Logis, penasaran, tak puas pada jawaban dangkal.', desc:'Pikiranmu adalah laboratorium yang tak pernah tutup. Kamu membongkar ide sampai ke rangka dasarnya, mencari pola yang konsisten — dan sering menemukan jalan yang tak terpikirkan orang lain.', str:['Analisis mendalam','Kreativitas konsep','Objektif'], grow:['Menuntaskan sebelum menyempurnakan','Menyuarakan ide lebih dini'], car:['Ilmuwan data','Penulis & pemikir','Rekayasa perangkat lunak'], match:['ENTJ','ENFJ']},
  ENTJ:{name:'Sang Komandan', h:348, tag:'Tegas, efisien, lahir untuk memimpin.', desc:'Kamu melihat tujuan dan langsung menyusun jalan tercepat ke sana. Energi kepemimpinanmu menular — orang ikut bergerak karena kamu membuat arah terasa jelas dan mungkin.', str:['Eksekusi cepat','Kepemimpinan alami','Percaya diri'], grow:['Mendengar sebelum memutuskan','Merayakan proses, bukan hanya hasil'], car:['Wirausaha','Manajemen produk','Konsultan strategi'], match:['INFP','INTP']},
  ENTP:{name:'Sang Penemu',   h:28,  tag:'Cerdas, berani menantang, penuh ide liar.', desc:'Aturan bagimu adalah undangan untuk bertanya “kenapa harus begitu?”. Kamu hidup dari debat sehat dan kemungkinan baru, dan paling bersinar saat memecahkan masalah yang orang lain anggap buntu.', str:['Ide tak habis-habis','Adaptif','Persuasif'], grow:['Menjaga satu fokus sampai tuntas','Peka pada ritme orang lain'], car:['Pendiri startup','Product designer','Negosiator'], match:['INFJ','INTJ']},
  INFJ:{name:'Sang Penasihat',h:288, tag:'Idealis tenang dengan wawasan yang dalam.', desc:'Kamu membaca yang tak terucap — motif, luka, dan potensi orang lain. Visimu tentang dunia yang lebih baik bukan mimpi kosong; kamu mengejarnya diam-diam, konsisten, dan mendalam.', str:['Empati tajam','Visi bermakna','Komitmen tinggi'], grow:['Menjaga batas energi','Menerima dunia yang tak sempurna'], car:['Psikolog & konselor','Penulis','Desainer riset'], match:['ENFP','ENTP']},
  INFP:{name:'Sang Pemimpi',  h:162, tag:'Puitis, lembut, setia pada nilai.', desc:'Dunia batinmu luas dan berwarna. Kamu mengukur hidup bukan dari pencapaian, tapi dari keselarasan dengan nilai yang kamu pegang — dan karyamu menyentuh orang tepat di bagian yang tak bisa mereka jelaskan.', str:['Imajinasi kaya','Autentik','Peduli mendalam'], grow:['Mengubah ideal jadi langkah kecil','Tahan pada kritik membangun'], car:['Penulis & penyair','Ilustrator','Terapis seni'], match:['ENFJ','ENTJ']},
  ENFJ:{name:'Sang Penggerak',h:16,  tag:'Karismatik, empatik, menggerakkan orang.', desc:'Kamu melihat versi terbaik dari setiap orang — dan mendorong mereka ke sana. Kehadiranmu menghangatkan ruangan, dan kemampuanmu menyatukan orang membuat hal besar terasa mungkin.', str:['Kepemimpinan empatik','Komunikasi hangat','Inspiratif'], grow:['Merawat diri sendiri dulu','Menerima penolakan tanpa personal'], car:['Pendidik','Community lead','HR & people'], match:['INFP','ISFP']},
  ENFP:{name:'Sang Pemantik', h:44,  tag:'Antusias, kreatif, jiwa yang bebas.', desc:'Kamu adalah percikan yang menyalakan ruangan. Ide, orang, dan kemungkinan baru menarikmu seperti magnet — dan antusiasmemu membuat orang lain berani bermimpi lebih besar.', str:['Energi menular','Koneksi antar-ide','Optimis'], grow:['Menuntaskan yang dimulai','Menjadikan rutinitas sebagai teman'], car:['Kreator konten','Brand strategist','Fasilitator'], match:['INTJ','INFJ']},
  ISTJ:{name:'Sang Pilar',    h:222, tag:'Andal, teliti, penjaga standar.', desc:'Ketika semua orang panik, kamu memeriksa fakta dan mengerjakan yang perlu dikerjakan. Janjimu adalah jaminan, dan sistem yang kamu rawat membuat dunia di sekitarmu berjalan sebagaimana mestinya.', str:['Konsisten & andal','Ketelitian tinggi','Integritas'], grow:['Membuka ruang bagi cara baru','Fleksibel pada perubahan mendadak'], car:['Auditor','Manajer operasi','Analis kepatuhan'], match:['ESFP','ESTP']},
  ISFJ:{name:'Sang Pelindung',h:190, tag:'Hangat, setia, perhatian pada detail.', desc:'Kamu mengingat hal kecil yang orang lain lupa — ulang tahun, alergi, cerita lama. Caramu peduli bukan lewat kata besar, tapi lewat kehadiran yang konsisten dan tindakan yang tepat waktu.', str:['Keandalan','Peka pada kebutuhan','Memori detail'], grow:['Berani berkata tidak','Mengapresiasi diri sendiri'], car:['Perawat','Guru','Manajer administrasi'], match:['ESTP','ESFP']},
  ESTJ:{name:'Sang Pengatur', h:356, tag:'Terorganisir, tegas, eksekutor andal.', desc:'Kamu mengubah kekacauan menjadi struktur. Ekspektasimu jelas, standarmu tinggi, dan kamu memastikan semua orang tahu perannya — karena bagimu, hasil terbaik lahir dari ketertiban.', str:['Organisasi kuat','Ketegasan','Tanggung jawab'], grow:['Mendengar perspektif berbeda','Delegasi tanpa mengontrol'], car:['Manajer proyek','Operasional','Administrasi publik'], match:['ISFP','ISTP']},
  ESFJ:{name:'Sang Perekat',  h:330, tag:'Peduli, sosial, penjaga harmoni.', desc:'Kamu adalah lem yang membuat komunitas tetap utuh. Kamu tahu siapa yang butuh bantuan sebelum mereka meminta, dan kamu memastikan setiap orang merasa dilihat dan dilibatkan.', str:['Keharmonisan tim','Kepraktisan','Loyalitas'], grow:['Tidak menggantungkan nilai diri pada pujian','Menerima konflik yang sehat'], car:['Event manager','Customer success','Humas'], match:['ISFP','ISTP']},
  ISTP:{name:'Sang Perajin',  h:174, tag:'Tenang, praktis, tangan yang memecahkan masalah.', desc:'Kamu belajar dengan membongkar, bukan dengan membaca manual. Di situasi genting kamu justru paling tenang — menganalisis, mencoba, dan memperbaiki dengan efisiensi yang membuat orang kagum.', str:['Problem-solving praktis','Tenang di bawah tekanan','Efisien'], grow:['Mengomunikasikan rencana','Merawat komitmen jangka panjang'], car:['Insinyur','Teknisi ahli','Pilot & atlet'], match:['ESTJ','ESFJ']},
  ISFP:{name:'Sang Seniman',  h:140, tag:'Lembut, artistik, hidup sepenuhnya di momen.', desc:'Kamu merasakan dunia lewat warna, tekstur, dan suasana. Kebebasan untuk berekspresi adalah napasmu, dan kebaikanmu muncul lewat karya — bukan pidato.', str:['Estetika kuat','Fleksibel','Hangat tanpa syarat'], grow:['Menyuarakan kebutuhan sendiri','Struktur ringan untuk karya besar'], car:['Desainer','Fotografer','Kriya & kuliner'], match:['ENFJ','ESFJ']},
  ESTP:{name:'Sang Pionir',   h:8,   tag:'Berani, sigap, pecinta aksi nyata.', desc:'Kamu membaca situasi secepat kilat dan bertindak saat yang lain masih menimbang. Risiko adalah bahan bakarmu, dan pesonamu membuat orang ikut terjun ke petualanganmu.', str:['Keberanian','Respons cepat','Karisma praktis'], grow:['Menimbang dampak jangka panjang','Sabar pada proses yang lambat'], car:['Sales & negosiasi','Wirausaha lapangan','Paramedis'], match:['ISFJ','ISTJ']},
  ESFP:{name:'Sang Bintang',  h:52,  tag:'Spontan, ceria, pusat kehidupan.', desc:'Hidup adalah panggung dan kamu tahu cara menikmatinya. Energimu membuat momen biasa jadi perayaan, dan kepekaanmu pada orang membuat semua orang merasa jadi bagian dari cerita.', str:['Membawa kegembiraan','Adaptif','Peka pada suasana'], grow:['Perencanaan waktu & finansial','Menyediakan ruang untuk refleksi'], car:['Entertainer','Hospitality','Marketing lapangan'], match:['ISTJ','ISFJ']}
};
Object.keys(ARCH).forEach(code => {
  ARCH[code].temp = code[1]==='N' ? (code[2]==='T' ? 'udara' : 'api') : (code[3]==='J' ? 'tanah' : 'air');
});
const LEN_NAME = {12:'Kilat', 24:'Standar', 40:'Mendalam'};

/* ── State ── */
const state = {
  len: 24, order: [], answers: [], idx: 0, running: false,
  result: null,
  history: store.get('prisma.history', []),
  muted: store.get('prisma.muted', false),
  filter: 'all', query: ''
};
let advTimer = 0, advLock = false, anaTimers = [];

/* ── Suara (WebAudio, disintesis — tanpa aset) ── */
const SFX = {
  ctx:null, master:null,
  ensure(){
    if (state.muted) return false;
    if (!this.ctx){
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = .5;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return true;
  },
  tone(freq, dur, type='sine', vol=.2, delay=0, slide=0){
    if (!this.ensure()) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + .012);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + dur + .05);
  },
  tick(i){ this.tone(340 + i*70, .14, 'triangle', .16); this.tone(680 + i*140, .09, 'sine', .06, .02); },
  back(){ this.tone(300, .12, 'triangle', .12, 0, -80); },
  nav(){ this.tone(520, .08, 'sine', .07); },
  open(){ this.tone(440, .1, 'sine', .09); this.tone(660, .12, 'sine', .06, .05); },
  chord(){ [261.6, 329.6, 392, 523.3].forEach((f,i) => this.tone(f, .9, 'sine', .12, i*.09)); this.tone(130.8, 1.2, 'triangle', .08); },
  setMuted(m){ if (this.ctx) this.master.gain.setTargetAtTime(m ? 0 : .5, this.ctx.currentTime, .03); }
};

/* ── Mesin animasi: satu rAF, hanya untuk yang terlihat ── */
const animators = new Map();
let rafId = 0;
function loop(ts){
  rafId = 0;
  let any = false;
  const t = ts / 1000;
  animators.forEach(a => { if (a.active){ any = true; a.draw(t); } });
  if (any && !document.hidden) rafId = requestAnimationFrame(loop);
}
function kick(){ if (!rafId && !RM && !document.hidden) rafId = requestAnimationFrame(loop); }
const aio = new IntersectionObserver(es => es.forEach(e => {
  const a = animators.get(e.target); if (!a) return;
  a.active = e.isIntersecting;
  if (a.active && RM) a.draw(1.7);
  kick();
}), {threshold:.05});
function registerAnimator(el, draw, resize){
  const a = {el, draw, active:false};
  animators.set(el, a);
  if (resize){
    resize();
    new ResizeObserver(() => { resize(); if (RM && a.active) a.draw(1.7); }).observe(el);
  }
  aio.observe(el);
  kick();
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden){ if (rafId){ cancelAnimationFrame(rafId); rafId = 0; } }
  else kick();
});
function fitCanvas(cv){
  const r = cv.getBoundingClientRect();
  const d = Math.min(window.devicePixelRatio || 1, 2);
  cv.width  = Math.max(1, Math.round(r.width * d));
  cv.height = Math.max(1, Math.round(r.height * d));
  const ctx = cv.getContext('2d');
  ctx.setTransform(d, 0, 0, d, 0, 0);
  return {w: r.width, h: r.height, ctx};
}

/* ── Toast ── */
function toast(msg, {type='info', action=null, duration=4200} = {}){
  const box = $('#toasts');
  const t = document.createElement('div');
  t.className = 'toast t-' + type;
  const icn = {ok:'check', warn:'warn', danger:'warn', info:'info'}[type] || 'info';
  t.innerHTML = icon(icn, 17) + '<span class="tmsg"></span>';
  t.querySelector('.tmsg').textContent = msg;
  let tm = 0;
  const dismiss = () => { clearTimeout(tm); t.classList.remove('show'); t.classList.add('hide'); setTimeout(() => t.remove(), 320); };
  if (action){
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'tact'; b.textContent = action.label;
    b.addEventListener('click', () => { action.fn(); dismiss(); });
    t.appendChild(b);
  }
  const x = document.createElement('button');
  x.type = 'button'; x.className = 'tx'; x.setAttribute('aria-label','Tutup notifikasi');
  x.innerHTML = icon('x', 13);
  x.addEventListener('click', dismiss);
  t.appendChild(x);
  box.appendChild(t);
  while (box.children.length > 3) box.firstChild.remove();
  requestAnimationFrame(() => t.classList.add('show'));
  tm = setTimeout(dismiss, duration);
}

/* ── Navigasi ── */
const nav = $('#nav'), menuBtn = $('#btn-menu'), mobileMenu = $('#mobile-menu');
function setMenu(open){
  mobileMenu.classList.toggle('open', open);
  menuBtn.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
}
menuBtn.addEventListener('click', () => { setMenu(!mobileMenu.classList.contains('open')); SFX.nav(); });
mobileMenu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
window.addEventListener('resize', () => { if (innerWidth > 920) setMenu(false); });

let scrollTick = false;
window.addEventListener('scroll', () => {
  if (scrollTick) return;
  scrollTick = true;
  requestAnimationFrame(() => {
    scrollTick = false;
    const y = scrollY;
    nav.classList.toggle('scrolled', y > 8);
    if (!RM) $$('.orb').forEach(o => { o.style.transform = `translate3d(0,${(y * parseFloat(o.dataset.depth || .1)).toFixed(1)}px,0)`; });
  });
}, {passive:true});

const spy = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const id = e.target.id === 'hasil' ? 'tes' : e.target.id;
  $$('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.target === id));
}), {rootMargin:'-35% 0px -55% 0px'});
['beranda','tes','hasil','arketipe','riwayat'].forEach(id => { const s = document.getElementById(id); if (s) spy.observe(s); });
$$('.nav-link').forEach(a => a.addEventListener('click', () => SFX.nav()));

/* ── Tombol suara ── */
const soundBtn = $('#btn-sound');
function updateSoundBtn(){
  soundBtn.classList.toggle('muted', state.muted);
  soundBtn.setAttribute('aria-pressed', String(!state.muted));
  soundBtn.title = state.muted ? 'Nyalakan suara' : 'Matikan suara';
}
soundBtn.addEventListener('click', () => {
  state.muted = !state.muted;
  store.set('prisma.muted', state.muted);
  SFX.setMuted(state.muted);
  updateSoundBtn();
  if (!state.muted) SFX.nav();
  toast(state.muted ? 'Suara dimatikan.' : 'Suara dinyalakan.', {type:'info', duration:2200});
});

/* ── Reveal ── */
const rio = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting){ e.target.classList.add('in'); rio.unobserve(e.target); }
}), {threshold:.12});
$$('.reveal').forEach(el => rio.observe(el));

/* ── Bintang hero ── */
(function initStars(){
  const cv = $('#fx-stars');
  let sw = 0, sh = 0, sctx = null, parts = [];
  const resize = () => {
    const f = fitCanvas(cv);
    sw = f.w; sh = f.h; sctx = f.ctx;
    const n = sw < 640 ? 55 : 100;
    parts = Array.from({length:n}, () => ({
      x:Math.random(), y:Math.random(), r:.6 + Math.random()*1.8,
      h:Math.random()*360, s:.004 + Math.random()*.012,
      tw:.5 + Math.random()*1.5, ph:Math.random()*6.283
    }));
  };
  const draw = t => {
    if (!sctx) return;
    sctx.clearRect(0, 0, sw, sh);
    for (const p of parts){
      const y = (((p.y - t*p.s) % 1) + 1) % 1;
      const a = .22 + .55 * Math.abs(Math.sin(t*p.tw + p.ph));
      const hue = (p.h + t*8) % 360;
      sctx.beginPath();
      sctx.fillStyle = `hsla(${hue},90%,70%,${a})`;
      sctx.arc(p.x*sw, y*sh, p.r, 0, 6.283);
      sctx.fill();
      if (p.r > 1.9){
        sctx.beginPath();
        sctx.fillStyle = `hsla(${hue},90%,65%,${a*.12})`;
        sctx.arc(p.x*sw, y*sh, p.r*4, 0, 6.283);
        sctx.fill();
      }
    }
  };
  registerAnimator(cv, draw, resize);
})();

/* ── Marquee ── */
(function buildMarquee(){
  const items = Object.entries(ARCH).map(([code,a]) =>
    `<span class="mq-item" style="--h:${a.h}"><i></i>${code} — ${a.name}</span>`).join('');
  $('#mq-track').innerHTML = items + items;
})();

/* ── Kuis ── */
function buildOrder(len){
  const per = len / 4, pool = [];
  for (let a = 0; a < 4; a++) pool.push(...QUESTIONS.filter(q => q.a === a).slice(0, per));
  for (let i = pool.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}
function clearAna(){ anaTimers.forEach(clearInterval); anaTimers = []; }
function updateProgress(){
  const answered = state.answers.filter(v => v !== null).length;
  const pct = Math.round(answered / state.order.length * 100);
  $('#q-fill').style.width = pct + '%';
  $('#q-pct').textContent = pct + '%';
}
function renderQ(dir = 1){
  const q = state.order[state.idx];
  $('#q-count').textContent = state.idx + 1;
  $('#q-total').textContent = state.order.length;
  updateProgress();
  $('#q-text').textContent = q.t;
  const body = $('#q-body');
  body.style.setProperty('--dx', (dir * 26) + 'px');
  body.classList.remove('qin'); void body.offsetWidth; body.classList.add('qin');
  $$('#q-opts .opt').forEach((b,i) => b.setAttribute('aria-checked', String(state.answers[state.idx] === i - 2)));
  $('#btn-back').disabled = state.idx === 0;
}
function startQuiz(len){
  clearAna(); clearTimeout(advTimer); advLock = false;
  state.len = len;
  state.order = buildOrder(len);
  state.answers = Array(len).fill(null);
  state.idx = 0;
  state.running = true;
  $('#start-panel').hidden = true;
  $('#analyzing').hidden = true;
  $('#quiz-panel').hidden = false;
  renderQ(1);
  SFX.open();
  scrollToEl($('#tes'));
  setTimeout(() => { const o = $('#q-opts .opt'); if (o) o.focus({preventScroll:true}); }, RM ? 50 : 380);
}
function selectAnswer(v){
  if (advLock || !state.running) return;
  state.answers[state.idx] = v;
  advLock = true;
  $$('#q-opts .opt').forEach((b,i) => b.setAttribute('aria-checked', String(i - 2 === v)));
  SFX.tick(v + 2);
  updateProgress();
  advTimer = setTimeout(() => {
    advLock = false;
    if (state.idx < state.order.length - 1){ state.idx++; renderQ(1); }
    else finish();
  }, RM ? 60 : 270);
}
function goBack(){
  if (!state.running || state.idx === 0) return;
  clearTimeout(advTimer); advLock = false;
  state.idx--;
  renderQ(-1);
  SFX.back();
}
function quitQuiz(){
  clearTimeout(advTimer); advLock = false; clearAna();
  state.running = false;
  $('#quiz-panel').hidden = true;
  $('#analyzing').hidden = true;
  $('#start-panel').hidden = false;
  SFX.back();
  toast('Tes dihentikan — jawaban sementara dibuang.', {type:'info'});
}
function finish(){
  state.running = false;
  const sums = [0,0,0,0], cnt = [0,0,0,0];
  state.order.forEach((q,i) => { sums[q.a] += (state.answers[i] ?? 0) * q.d; cnt[q.a]++; });
  const pcts = sums.map((s,i) => clamp(Math.round((s / (2 * cnt[i]) + 1) * 50), 0, 100));
  const code = pcts.map((p,i) => p >= 50 ? AXES[i].L.l : AXES[i].R.l).join('');
  const seed = hash(code + '|' + pcts.join(',') + '|' + state.answers.join(','));
  const res = { id:'r' + Date.now().toString(36) + Math.floor(Math.random()*1e4), code, pcts, seed, ts:Date.now(), len:state.order.length };
  state.history.unshift(res);
  state.history = state.history.slice(0, 30);
  store.set('prisma.history', state.history);
  renderHistory();
  runAnalyzing(() => {
    renderResult(res, 'fresh');
    $('#start-panel').hidden = false;
    scrollToEl($('#hasil'));
    SFX.chord();
  });
}
function runAnalyzing(done){
  $('#quiz-panel').hidden = true;
  const ana = $('#analyzing');
  ana.hidden = false;
  const msgs = ['Membaca pola jawabanmu…','Menimbang empat spektrum…','Meracik arketipemu…'];
  const status = $('#ana-status');
  let i = 0;
  status.textContent = msgs[0];
  const cyc = setInterval(() => {
    i = (i + 1) % msgs.length;
    status.classList.remove('swap'); void status.offsetWidth;
    status.textContent = msgs[i];
    status.classList.add('swap');
  }, 560);
  anaTimers.push(cyc);
  const end = setTimeout(() => { clearAna(); ana.hidden = true; done(); }, RM ? 350 : 1750);
  anaTimers.push(end);
}

/* ── Hasil ── */
const matchBtn = m => `<button type="button" class="match-card" data-code="${m}" style="--h:${ARCH[m].h}"><b>${m}</b><span>${ARCH[m].name}</span></button>`;
function barsHTML(res){
  return AXES.map((ax,i) => {
    const p = res.pcts[i], win = p >= 50, bal = Math.abs(p - 50) <= 8;
    return `<div class="bar-row" style="--hl:${ax.L.h};--hr:${ax.R.h}">
      <div class="bar-labels">
        <span class="${win?'win':''}">${ax.L.l} · ${ax.L.name} <b>${p}%</b></span>
        <span class="${!win?'win':''}"><b>${100-p}%</b> ${ax.R.name} · ${ax.R.l}</span>
      </div>
      <div class="bar-track"><i class="bar-fill" data-w="${p}"></i><i class="bar-mid"></i></div>
      <div class="bar-sub">${ax.label}${bal ? '<em class="bal">seimbang</em>' : ''}</div>
    </div>`;
  }).join('');
}
function renderResult(res, mode){
  state.result = res;
  const A = ARCH[res.code];
  const sec = $('#hasil');
  sec.style.setProperty('--res-h', A.h);
  sec.hidden = false;

  const badge = $('#res-badge');
  if (mode === 'demo'){ badge.className = 'chip tone-warn'; badge.textContent = 'Mode contoh'; }
  else if (mode === 'history'){ badge.className = 'chip tone-info'; badge.textContent = 'Dari riwayat'; }
  else { badge.className = 'chip tone-ok'; badge.textContent = 'Hasil baru · tersimpan'; }
  $('#res-note').innerHTML =
    mode === 'demo' ? 'Ini hasil contoh supaya kamu bisa merasakan tampilannya — <a href="#tes">ambil tes asli</a> untuk spektrummu sendiri.' :
    mode === 'history' ? 'Diambil pada ' + fmtDate(res.ts) + ' · tersimpan lokal di perangkat ini.' :
    'Disimpan otomatis di riwayat perangkatmu. Tidak ada data yang dikirim ke mana pun.';

  $('#res-code').innerHTML = res.code.split('').map((ch,i) => `<span style="--i:${i};--lh:${A.h + i*26}">${ch}</span>`).join('');
  const nameEl = $('#res-name');
  nameEl.textContent = A.name;
  const T = TEMPS[A.temp];
  $('#res-chips').innerHTML =
    `<span class="chip" style="--h:${T.h}">${icon(T.ic,13)} ${T.name} · ${T.sub}</span>` +
    `<span class="chip">${res.len} pertanyaan · ${LEN_NAME[res.len] || ''}</span>`;
  $('#res-tag').textContent = '“' + A.tag + '”';
  $('#res-desc').textContent = A.desc;
  $('#res-str').innerHTML = A.str.map(s => `<li>${icon('check',15)}<span>${s}</span></li>`).join('');
  $('#res-growth').innerHTML = A.grow.map(s => `<li>${icon('sprout',15)}<span>${s}</span></li>`).join('');
  $('#res-careers').innerHTML = A.car.map(c => `<span class="chip soft">${c}</span>`).join('');
  $('#res-match').innerHTML = A.match.map(matchBtn).join('');
  $('#res-bars').innerHTML = barsHTML(res);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    $$('#res-bars .bar-fill').forEach(f => f.style.width = f.dataset.w + '%');
  }));
  nameEl.focus({preventScroll:true});
}

/* ── Pita spektrum (generatif, seeded) ── */
function ribbonRenderer(ctx, w, h, seed, hue){
  const rnd = mulberry32(seed);
  const bands = [];
  for (let i = 0; i < 5; i++){
    bands.push({
      amp:h*(.10 + rnd()*.20), freq:.7 + rnd()*1.6, ph:rnd()*6.283,
      sp:.25 + rnd()*.5, yb:h*(.28 + rnd()*.44), lw:h*(.018 + rnd()*.045),
      ho:-45 + rnd()*90, al:.30 + rnd()*.35
    });
  }
  const steps = Math.max(70, Math.round(w / 7));
  return t => {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (const b of bands){
      ctx.beginPath();
      for (let s = 0; s <= steps; s++){
        const u = s / steps, x = u * w, p = u * 6.283 * b.freq;
        const y = b.yb + Math.sin(p + b.ph + t*b.sp) * b.amp * Math.sin(u*Math.PI)
                + Math.sin(p*2.3 + t*b.sp*1.7 + b.ph) * b.amp * .28;
        s ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      const g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, `hsla(${hue + b.ho},95%,62%,0)`);
      g.addColorStop(.5, `hsla(${hue + b.ho},95%,64%,${b.al})`);
      g.addColorStop(1, `hsla(${hue + b.ho + 55},95%,62%,0)`);
      ctx.strokeStyle = g;
      ctx.lineWidth = b.lw;
      ctx.shadowColor = `hsla(${hue + b.ho},95%,60%,.7)`;
      ctx.shadowBlur = Math.max(8, h * .05);
      ctx.stroke();
    }
    ctx.restore();
  };
}
(function initRibbon(){
  const cv = $('#fx-ribbon');
  let w = 0, h = 0, ctx = null, cacheKey = '', render = null;
  const resize = () => { const f = fitCanvas(cv); w = f.w; h = f.h; ctx = f.ctx; cacheKey = ''; };
  const draw = t => {
    if (!ctx || !state.result || w < 2) return;
    const hue = ARCH[state.result.code].h;
    const key = state.result.seed + '|' + hue + '|' + w + '|' + h;
    if (key !== cacheKey){ cacheKey = key; render = ribbonRenderer(ctx, w, h, state.result.seed, hue); }
    ctx.clearRect(0, 0, w, h);
    render(t * .55);
  };
  registerAnimator(cv, draw, resize);
})();

/* ── Kartu hasil (PNG 1080×1440) ── */
function rr(c,x,y,w,h,r){
  c.beginPath();
  c.moveTo(x+r,y);
  c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r);
  c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r);
  c.closePath();
}
function wrapText(c, txt, max){
  const words = txt.split(' '), lines = [];
  let line = '';
  for (const wd of words){
    const test = line ? line + ' ' + wd : wd;
    if (c.measureText(test).width > max && line){ lines.push(line); line = wd; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}
function drawCard(c, W, H, res){
  const A = ARCH[res.code], hue = A.h;
  let g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#0d0918'); g.addColorStop(.55, `hsl(${hue},45%,12%)`); g.addColorStop(1, '#0a0714');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  g = c.createLinearGradient(0, 0, W, 0);
  ['#ff3d8b','#ff7a45','#ffb020','#a3e635','#2dd4bf','#38bdf8','#8b5cf6'].forEach((col,i) => g.addColorStop(i/6, col));
  c.fillStyle = g; c.fillRect(0, 0, W, 10);

  // Merek
  c.fillStyle = '#8b5cf6';
  c.beginPath(); c.moveTo(80,122); c.lineTo(101,84); c.lineTo(122,122); c.closePath(); c.fill();
  c.strokeStyle = '#ff3d8b'; c.lineWidth = 4; c.beginPath(); c.moveTo(114,96); c.lineTo(140,86); c.stroke();
  c.strokeStyle = '#ffb020'; c.beginPath(); c.moveTo(116,104); c.lineTo(142,104); c.stroke();
  c.strokeStyle = '#2dd4bf'; c.beginPath(); c.moveTo(114,112); c.lineTo(140,122); c.stroke();
  c.fillStyle = '#f2edff'; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
  c.font = '700 40px Unbounded, sans-serif';
  c.fillText('PRISMA', 158, 118);
  c.fillStyle = '#a79bc8'; c.font = '400 25px "JetBrains Mono", monospace'; c.textAlign = 'right';
  c.fillText(fmtDate(res.ts), W - 80, 114);

  c.textAlign = 'left';
  try{ c.letterSpacing = '7px'; }catch(e){}
  c.fillStyle = `hsla(${hue},85%,75%,.95)`;
  c.font = '600 26px "JetBrains Mono", monospace';
  c.fillText('SPEKTRUM KEPRIBADIAN', 80, 218);
  try{ c.letterSpacing = '0px'; }catch(e){}

  // Kode besar
  c.font = '800 168px Unbounded, sans-serif';
  const letters = res.code.split('');
  const widths = letters.map(ch => c.measureText(ch).width);
  const gap = 22;
  const total = widths.reduce((a,b) => a+b, 0) + gap * 3;
  let x = (W - total) / 2;
  c.textAlign = 'left';
  letters.forEach((ch,i) => {
    const lh = hue + i*26;
    c.fillStyle = `hsl(${lh},90%,72%)`;
    c.shadowColor = `hsla(${lh},90%,60%,.6)`; c.shadowBlur = 42;
    c.fillText(ch, x, 424);
    x += widths[i] + gap;
  });
  c.shadowBlur = 0;

  // Nama + tagline
  c.textAlign = 'center';
  let ns = 62;
  c.font = `700 ${ns}px Unbounded, sans-serif`;
  while (c.measureText(A.name).width > 920 && ns > 30){ ns -= 2; c.font = `700 ${ns}px Unbounded, sans-serif`; }
  c.fillStyle = '#f2edff';
  c.fillText(A.name, W/2, 524);
  c.font = '500 30px "Plus Jakarta Sans", sans-serif';
  c.fillStyle = '#a79bc8';
  wrapText(c, '“' + A.tag + '”', 880).forEach((ln,i) => c.fillText(ln, W/2, 578 + i*44));

  // Pita spektrum
  c.save(); c.translate(0, 640);
  ribbonRenderer(c, W, 380, res.seed, hue)(2.6);
  c.restore();
  g = c.createLinearGradient(0, 960, 0, 1070);
  g.addColorStop(0, 'rgba(10,7,20,0)'); g.addColorStop(1, `hsla(${hue},45%,11%,.9)`);
  c.fillStyle = g; c.fillRect(0, 960, W, 110);

  // Bar spektrum
  AXES.forEach((ax,i) => {
    const p = res.pcts[i], y = 1084 + i*80;
    c.font = '600 25px "JetBrains Mono", monospace';
    c.textAlign = 'left';
    c.fillStyle = p >= 50 ? '#f2edff' : '#8d81b5';
    c.fillText(`${ax.L.l} · ${ax.L.name}  ${p}%`, 80, y);
    c.textAlign = 'right';
    c.fillStyle = p < 50 ? '#f2edff' : '#8d81b5';
    c.fillText(`${100-p}%  ${ax.R.name} · ${ax.R.l}`, W - 80, y);
    rr(c, 80, y + 16, 920, 16, 8);
    c.fillStyle = `hsla(${ax.R.h},70%,55%,.22)`; c.fill();
    const fw = Math.max(16, 920 * p / 100);
    const bg = c.createLinearGradient(80, 0, 80 + fw, 0);
    bg.addColorStop(0, `hsla(${ax.L.h},90%,58%,.95)`); bg.addColorStop(1, `hsla(${ax.L.h},90%,68%,.65)`);
    rr(c, 80, y + 16, fw, 16, 8);
    c.fillStyle = bg; c.fill();
    c.fillStyle = 'rgba(255,255,255,.3)';
    c.fillRect(80 + 459, y + 16, 2, 16);
  });

  // Footer kartu
  c.font = '400 23px "JetBrains Mono", monospace';
  c.textAlign = 'left'; c.fillStyle = '#6f6494';
  c.fillText('PRISMA · 16 ARKETIPE · ' + res.code, 80, H - 52);
  c.textAlign = 'right';
  c.fillText('dibuat di perangkatmu', W - 80, H - 52);
  rr(c, 14, 14, W - 28, H - 28, 26);
  c.strokeStyle = `hsla(${hue},80%,62%,.4)`; c.lineWidth = 2; c.stroke();
}
async function downloadCard(){
  const res = state.result;
  if (!res){ toast('Belum ada hasil untuk diunduh.', {type:'warn'}); return; }
  const btn = $('#btn-download');
  btn.disabled = true;
  try{
    await Promise.race([
      Promise.all([
        document.fonts.load('800 168px Unbounded'),
        document.fonts.load('700 62px Unbounded'),
        document.fonts.load('600 25px "JetBrains Mono"'),
        document.fonts.load('500 30px "Plus Jakarta Sans"')
      ]),
      new Promise(r => setTimeout(r, 1500))
    ]);
    const cv = document.createElement('canvas');
    cv.width = 1080; cv.height = 1440;
    drawCard(cv.getContext('2d'), 1080, 1440, res);
    cv.toBlob(b => {
      btn.disabled = false;
      if (!b){ toast('Gagal membuat kartu. Coba lagi.', {type:'danger'}); return; }
      const u = URL.createObjectURL(b);
      const a = document.createElement('a');
      a.href = u; a.download = `prisma-${res.code.toLowerCase()}.png`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(u), 4000);
      toast('Kartu hasil terunduh — siap dibagikan!', {type:'ok'});
      SFX.open();
    }, 'image/png');
  }catch(e){
    btn.disabled = false;
    toast('Terjadi kendala saat membuat kartu.', {type:'danger'});
  }
}
async function copyText(t){
  try{ await navigator.clipboard.writeText(t); return true; }
  catch(e){
    try{
      const ta = document.createElement('textarea');
      ta.value = t; ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy');
      ta.remove(); return ok;
    }catch(_){ return false; }
  }
}
async function copySummary(){
  const res = state.result;
  if (!res){ toast('Belum ada hasil untuk disalin.', {type:'warn'}); return; }
  const A = ARCH[res.code];
  const lines = [
    'PRISMA — Hasil Spektrum Kepribadian',
    `${res.code} · ${A.name}`,
    `“${A.tag}”`,
    ...AXES.map((ax,i) => `${ax.label}: ${ax.L.l} ${res.pcts[i]}% / ${ax.R.l} ${100-res.pcts[i]}%`),
    'Kekuatan: ' + A.str.join(', '),
    'Jalur yang cocok: ' + A.car.join(', '),
    '#PRISMA16'
  ];
  const ok = await copyText(lines.join('\n'));
  toast(ok ? 'Ringkasan disalin ke clipboard.' : 'Clipboard tidak tersedia di browser ini.', {type: ok ? 'ok' : 'danger'});
  if (ok) SFX.open();
}

/* ── Galeri & drawer ── */
function renderGallery(){
  const q = state.query.trim().toLowerCase();
  const entries = Object.entries(ARCH).filter(([code,a]) => {
    if (state.filter !== 'all' && a.temp !== state.filter) return false;
    if (!q) return true;
    return (code + ' ' + a.name + ' ' + a.tag + ' ' + TEMPS[a.temp].name).toLowerCase().includes(q);
  });
  $('#gal-grid').innerHTML = entries.map(([code,a]) => `
    <button type="button" class="arc-card" data-code="${code}" style="--h:${a.h}">
      <span class="arc-orb"></span>
      <span class="arc-temp">${icon(TEMPS[a.temp].ic,12)} ${TEMPS[a.temp].name}</span>
      <span class="arc-code">${code}</span>
      <span class="arc-name">${a.name}</span>
      <span class="arc-tag">${a.tag}</span>
      <span class="arc-cta">Lihat detail ${icon('arrow',12)}</span>
    </button>`).join('');
  $('#gal-empty').hidden = entries.length > 0;
  $('#gal-count').textContent = entries.length + ' arketipe';
}
$('#gal-search').addEventListener('input', e => { state.query = e.target.value; renderGallery(); });
$('#gal-filters').addEventListener('click', e => {
  const b = e.target.closest('.fchip'); if (!b) return;
  state.filter = b.dataset.temp;
  $$('#gal-filters .fchip').forEach(c => c.classList.toggle('active', c === b));
  renderGallery(); SFX.nav();
});
$('#gal-reset').addEventListener('click', () => {
  state.query = ''; state.filter = 'all';
  $('#gal-search').value = '';
  $$('#gal-filters .fchip').forEach(c => c.classList.toggle('active', c.dataset.temp === 'all'));
  renderGallery();
});
$('#gal-grid').addEventListener('click', e => {
  const card = e.target.closest('.arc-card');
  if (card) openDrawer(card.dataset.code);
});

const drawer = $('#drawer'), scrim = $('#drawer-scrim');
let lastFocus = null;
function openDrawer(code){
  const A = ARCH[code]; if (!A) return;
  const T = TEMPS[A.temp];
  drawer.style.setProperty('--h', A.h);
  $('#drawer-body').innerHTML = `
    <div class="d-code">${code.split('').map((ch,i) => `<span style="--lh:${A.h + i*26}">${ch}</span>`).join('')}</div>
    <h3 id="drawer-title">${A.name}</h3>
    <div class="chips"><span class="chip" style="--h:${T.h}">${icon(T.ic,13)} ${T.name} · ${T.sub}</span></div>
    <p class="d-tag">“${A.tag}”</p>
    <p class="d-desc">${A.desc}</p>
    <h4 class="mini-h">Kekuatan</h4>
    <ul class="ticks">${A.str.map(s => `<li>${icon('check',15)}<span>${s}</span></li>`).join('')}</ul>
    <h4 class="mini-h">Ruang tumbuh</h4>
    <ul class="ticks grow">${A.grow.map(s => `<li>${icon('sprout',15)}<span>${s}</span></li>`).join('')}</ul>
    <h4 class="mini-h">Jalur yang cocok</h4>
    <div class="chips">${A.car.map(c => `<span class="chip soft">${c}</span>`).join('')}</div>
    <h4 class="mini-h">Sejiwa dengan</h4>
    <div class="match-row">${A.match.map(matchBtn).join('')}</div>
    <button type="button" class="btn btn-primary d-cta" id="drawer-cta">${icon('play',15)} Ambil tesnya</button>`;
  if (!drawer.classList.contains('open')){
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    scrim.classList.add('show');
    drawer.setAttribute('aria-hidden','false');
    document.body.classList.add('lock');
    SFX.open();
  }
  $('#drawer-body').scrollTop = 0;
  $('#drawer-close').focus();
}
function closeDrawer(){
  if (!drawer.classList.contains('open')) return;
  drawer.classList.remove('open');
  scrim.classList.remove('show');
  drawer.setAttribute('aria-hidden','true');
  document.body.classList.remove('lock');
  if (lastFocus && lastFocus.focus) lastFocus.focus({preventScroll:true});
}
$('#drawer-close').addEventListener('click', closeDrawer);
scrim.addEventListener('click', closeDrawer);
$('#drawer-body').addEventListener('click', e => {
  const m = e.target.closest('.match-card');
  if (m){ openDrawer(m.dataset.code); return; }
  if (e.target.closest('#drawer-cta')){ closeDrawer(); scrollToEl($('#tes')); }
});
$('#res-match').addEventListener('click', e => {
  const m = e.target.closest('.match-card');
  if (m) openDrawer(m.dataset.code);
});

/* ── Riwayat ── */
function renderHistory(){
  const list = $('#hist-list');
  const n = state.history.length;
  $('#hist-empty').hidden = n > 0;
  $('#btn-clear').hidden = n === 0;
  $('#hist-count').textContent = n + ' hasil';
  list.innerHTML = state.history.map(h => {
    const A = ARCH[h.code];
    return `<li class="hist-item" style="--h:${A.h}">
      <span class="hist-dot"></span>
      <div class="hist-main"><b>${h.code} — ${A.name}</b><span>${fmtDate(h.ts)} · ${LEN_NAME[h.len] || h.len} (${h.len})</span></div>
      <div class="hist-spark" aria-hidden="true">${h.pcts.map((p,i) => `<i style="height:${Math.max(14,p)}%;--h:${AXES[i].L.h}"></i>`).join('')}</div>
      <div class="hist-actions">
        <button type="button" class="icon-btn" data-act="view" data-id="${h.id}" aria-label="Lihat hasil ${h.code}" title="Lihat">${icon('eye',16)}</button>
        <button type="button" class="icon-btn del" data-act="del" data-id="${h.id}" aria-label="Hapus hasil ${h.code}" title="Hapus">${icon('trash',16)}</button>
      </div>
    </li>`;
  }).join('');
}
$('#hist-list').addEventListener('click', e => {
  const b = e.target.closest('button[data-act]'); if (!b) return;
  const idx = state.history.findIndex(h => h.id === b.dataset.id);
  if (idx < 0) return;
  const item = state.history[idx];
  if (b.dataset.act === 'view'){
    renderResult(item, 'history');
    scrollToEl($('#hasil'));
    SFX.open();
  } else {
    state.history.splice(idx, 1);
    store.set('prisma.history', state.history);
    renderHistory();
    SFX.back();
    toast(`Hasil ${item.code} dihapus.`, {type:'warn', duration:6000, action:{label:'Urungkan', fn(){
      if (state.history.some(h => h.id === item.id)) return;
      state.history.splice(Math.min(idx, state.history.length), 0, item);
      store.set('prisma.history', state.history);
      renderHistory();
      toast('Hasil dikembalikan.', {type:'ok', duration:2500});
    }}});
  }
});
$('#btn-clear').addEventListener('click', () => {
  if (!state.history.length) return;
  const backup = state.history.slice();
  state.history = [];
  store.set('prisma.history', state.history);
  renderHistory();
  SFX.back();
  toast('Semua riwayat dibersihkan.', {type:'warn', duration:6500, action:{label:'Urungkan', fn(){
    state.history = [...backup, ...state.history.filter(h => !backup.some(b => b.id === h.id))];
    store.set('prisma.history', state.history);
    renderHistory();
    toast('Riwayat dikembalikan.', {type:'ok', duration:2500});
  }}});
});

/* ── Contoh hasil ── */
function demo(){
  const res = { id:'demo', code:'ENFP', pcts:[72,81,34,28], seed:11162026, ts:Date.now(), len:24 };
  renderResult(res, 'demo');
  scrollToEl($('#hasil'));
  SFX.chord();
}
$('#btn-demo').addEventListener('click', demo);
$('#btn-demo2').addEventListener('click', demo);

/* ── Wiring tes & hasil ── */
$('#len-group').addEventListener('click', e => {
  const b = e.target.closest('.len-card'); if (!b) return;
  state.len = parseInt(b.dataset.len, 10);
  $$('#len-group .len-card').forEach(c => {
    const sel = c === b;
    c.classList.toggle('sel', sel);
    c.setAttribute('aria-checked', String(sel));
  });
  $('#start-label').textContent = `Mulai · ${state.len} pertanyaan`;
  SFX.nav();
});
$('#btn-start').addEventListener('click', () => startQuiz(state.len));
$('#btn-back').addEventListener('click', goBack);
$('#btn-quit').addEventListener('click', quitQuiz);
$('#q-opts').addEventListener('click', e => {
  const b = e.target.closest('.opt'); if (!b) return;
  selectAnswer(parseInt(b.dataset.v, 10));
});
$('#q-opts').addEventListener('keydown', e => {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  const opts = $$('#q-opts .opt');
  const i = opts.indexOf(document.activeElement);
  if (i < 0) return;
  e.preventDefault();
  const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + opts.length) % opts.length;
  opts[next].focus();
});
$('#btn-download').addEventListener('click', downloadCard);
$('#btn-copy').addEventListener('click', copySummary);
$('#btn-retake').addEventListener('click', () => startQuiz(state.result ? state.result.len : state.len));

/* ── Keyboard global ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape'){
    if (drawer.classList.contains('open')){ closeDrawer(); return; }
    if (mobileMenu.classList.contains('open')){ setMenu(false); return; }
  }
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.target instanceof Element && e.target.closest('input, textarea')) return;
  if (drawer.classList.contains('open')) return;
  if ($('#quiz-panel').hidden || !state.running) return;
  if (/^[1-5]$/.test(e.key)){ e.preventDefault(); selectAnswer(parseInt(e.key, 10) - 3); }
  else if (e.key === 'Backspace'){ e.preventDefault(); goBack(); }
});

/* ── Inisialisasi ── */
$$('[data-icon]').forEach(el => el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon, parseInt(el.dataset.size || 18, 10))));
updateSoundBtn();
renderGallery();
renderHistory();

})();
