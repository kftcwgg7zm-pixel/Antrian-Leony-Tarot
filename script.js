<script>
const $ = s => document.querySelector(s);
const hemat = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hp = window.matchMedia('(max-width: 720px)').matches;

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'bintang';
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx8FJ8APz99HvYnSxKxiD2AdeD03Hq8LtcBtfaV7QdNj8MvWGvnfF1F7fTp02pfwkAr/exec'; 

/* ══════ GERBANG ══════ */
(function gerbang(){
  const g = $('#gerbang');
  const buka = () => {
    if(g.classList.contains('buka')) return;
    g.classList.add('buka');
    setTimeout(() => g.classList.add('pergi'), 1300);
  };
  g.addEventListener('click', buka);
  setTimeout(buka, hemat ? 400 : 2500);
})();

/* ══════ SAYAP MALAIKAT ══════ */
(function sayap(){
  const svg = $('#sayap'), ns = 'http://www.w3.org/2000/svg';
  const grad = document.createElementNS(ns, 'defs');
  grad.innerHTML = `<linearGradient id="bulu-g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/><stop offset="55%" stop-color="#fbfdff"/>
      <stop offset="100%" stop-color="#dfe9fb"/></linearGradient>`;
  svg.appendChild(grad);
  const sisi = (arah) => {
    const g = document.createElementNS(ns, 'g');
    for(let i = 0; i < 9; i++){
      const t = i / 8;
      const p = document.createElementNS(ns, 'ellipse');
      const rx = 14 + t * 16, ry = 52 + t * 78;
      const cx = 400 + arah * (44 + t * 178);
      const cy = 152 - t * 26;
      p.setAttribute('cx', cx); p.setAttribute('cy', cy);
      p.setAttribute('rx', rx); p.setAttribute('ry', ry);
      p.setAttribute('fill', 'url(#bulu-g)');
      p.setAttribute('opacity', String(0.94 - t * 0.24));
      p.setAttribute('transform', `rotate(${arah * (16 + t * 44)} ${cx} ${cy})`);
      g.appendChild(p);
    }
    return g;
  };
  svg.appendChild(sisi(-1)); svg.appendChild(sisi(1));
})();

/* ══════ GELEMBUNG · BULU · KERLIP ══════ */
(function hias(){
  const w = $('#hias');
  const acak = (a, b) => a + Math.random() * (b - a);

  const jumlahSabun = hemat ? 0 : (hp ? 11 : 20);
  for(let i = 0; i < jumlahSabun; i++){
    const d = acak(22, 96);
    const el = document.createElement('div');
    el.className = 'sabun';
    el.style.cssText = `left:${acak(-2, 98)}%;--d:${d}px;--dur:${acak(20, 40)}s;--del:${-acak(0, 34)}s;--gy:${acak(5, 11)}s`;
    el.innerHTML = '<div class="film"></div>';
    w.appendChild(el);
  }

  const jumlahBulu = hemat ? 0 : (hp ? 3 : 6);
  for(let i = 0; i < jumlahBulu; i++){
    const b = document.createElement('div');
    b.className = 'bulu';
    b.style.cssText = `left:${acak(4, 94)}%;--bw:${acak(20, 36)}px;--bd:${acak(26, 46)}s;--bdl:${-acak(0, 40)}s`;
    b.innerHTML = `<svg viewBox="0 0 40 96">
      <path d="M20 2 C 34 24, 36 58, 21 92 C 6 58, 6 24, 20 2 Z" fill="#ffffff" opacity=".9"/>
      <path d="M20 6 L20 90" stroke="#dfe8f8" stroke-width="1.4"/>
      </svg>`;
    w.appendChild(b);
  }

  const jumlahKerlip = hemat ? 0 : (hp ? 12 : 24);
  for(let i = 0; i < jumlahKerlip; i++){
    const k = document.createElement('div');
    k.className = 'kerlip';
    k.textContent = Math.random() > .5 ? '✧' : '✦';
    k.style.cssText = `left:${acak(2, 97)}%;top:${acak(2, 94)}%;--ks:${acak(9, 19)}px;--kd:${acak(3, 7)}s;--kdl:${-acak(0, 7)}s`;
    w.appendChild(k);
  }
})();

/* ══════ JEJAK KILAU ══════ */
if(!hemat){
  let akhir = 0;
  addEventListener('pointermove', e => {
    const n = Date.now();
    if(n - akhir < 85) return;
    akhir = n;
    const s = document.createElement('div');
    s.className = 'jejak';
    s.textContent = Math.random() > .5 ? '✧' : '·';
    s.style.left = e.clientX + 'px';
    s.style.top = e.clientY + 'px';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }, {passive:true});
}

/* ══════ MUSIK KAYANGAN ══════ */
const suara = (() => {
  let ctx = null, gain = null, timer = null, hidup = false;
  const nada = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
  function petik(f, t, vol){
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + .04);
    g.gain.exponentialRampToValueAtTime(.0001, t + 3.4);
    o.connect(g); g.connect(gain); o.start(t); o.stop(t + 3.6);
  }
  return {
    ganti(){
      if(!ctx){
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        gain = ctx.createGain(); gain.gain.value = 0; gain.connect(ctx.destination);
      }
      ctx.resume();
      hidup = !hidup;
      gain.gain.linearRampToValueAtTime(hidup ? .5 : 0, ctx.currentTime + 1.1);
      if(hidup){
        timer = setInterval(() => {
          const t = ctx.currentTime + Math.random() * .4;
          petik(nada[Math.floor(Math.random() * nada.length)], t, .05);
        }, 2400);
      } else clearInterval(timer);
      return hidup;
    }
  };
})();
$('#btn-suara').addEventListener('click', e => {
  const on = suara.ganti();
  e.currentTarget.classList.toggle('on', on);
  e.currentTarget.textContent = on ? '♫' : '♪';
});
$('#btn-atas').addEventListener('click', () => scrollTo({top:0, behavior:'smooth'}));

/* ══════ FETCH DATA CEPAT DARI GOOGLE SHEET ══════ */
let dAntrian = [];

async function muatAntrianServer() {
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL);
    const dataServer = await res.json();
    if(Array.isArray(dataServer)){
      dAntrian = dataServer;
    }
  } catch(e) {
    console.error("Gagal mengambil data dari Google Sheet:", e);
  }
  gambarAntrian();
  gambarAdmin();
}

// Kirim ke Spreadsheet di background tanpa membuat UI / tombol macet
function kirimKeSpreadsheetBg(payload) {
  if(!GOOGLE_SCRIPT_URL) return;
  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(e => console.error("Background sync error:", e));
}

/* ══════ UTIL ══════ */
const aman = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function kapan(ts){
  const d = new Date(ts), s = (Date.now() - ts) / 1000;
  if(isNaN(s) || s < 60) return 'baru aja';
  if(s < 3600) return Math.floor(s/60) + ' menit lalu';
  if(s < 86400) return Math.floor(s/3600) + ' jam lalu';
  return d.toLocaleDateString('id-ID', {day:'numeric', month:'short'});
}
function status(el, teks, jenis){
  el.textContent = teks;
  el.className = 'pesan-status tampil ' + jenis;
  if(jenis === 'ok') setTimeout(() => el.className = 'pesan-status', 4000);
}

/* ══════ NAVIGASI UTAMA ══════ */
const tabs = document.querySelectorAll('.tab');
function keHalaman(nama){
  document.querySelectorAll('.hal').forEach(h => h.classList.toggle('aktif', h.id === 'hal-' + nama));
  tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.hal === nama)));
  scrollTo({top:0, behavior:'smooth'});
}
tabs.forEach(t => t.addEventListener('click', () => keHalaman(t.dataset.hal)));

/* ══════ SUB-TABS (ALL & FAST TRACK) ══════ */
let tipeSubTabAktif = 'All';
$('#tab-all').addEventListener('click', () => {
  tipeSubTabAktif = 'All';
  $('#tab-all').classList.add('aktif');
  $('#tab-fasttrack').classList.remove('aktif');
  gambarAntrian();
});
$('#tab-fasttrack').addEventListener('click', () => {
  tipeSubTabAktif = 'Fast Track';
  $('#tab-fasttrack').classList.add('aktif');
  $('#tab-all').classList.remove('aktif');
  gambarAntrian();
});

/* ══════ RENDER ANTRIAN (CUSTOMER) ══════ */
let cariAntrianTeks = '';
$('#cari-antrian').addEventListener('input', e => {
  cariAntrianTeks = e.target.value.trim().toLowerCase();
  gambarAntrian();
});

function gambarAntrian(){
  const el = $('#feed-antrian');
  let filtered = dAntrian;
  
  if(tipeSubTabAktif === 'Fast Track'){
    filtered = filtered.filter(x => x.tipe === 'Fast Track');
  }

  const hariIni = new Date().toDateString();
  const nanyaHariIni = filtered.filter(x => {
    const t = Number(x.ts);
    return !isNaN(t) && new Date(t).toDateString() === hariIni;
  }).length;

  $('#st-hari-ini').textContent = nanyaHariIni;
  $('#st-belum').textContent = filtered.filter(x => x.status === 'Belum Dibaca').length;
  $('#st-sudah').textContent = filtered.filter(x => x.status === 'Sudah Dibaca').length;

  if(cariAntrianTeks){
    filtered = filtered.filter(x => x.detail.toLowerCase().includes(cariAntrianTeks));
  }

  if(!filtered.length){
    el.innerHTML = '<div class="kosong"><div class="em">💌</div><div class="j">antrian kosong</div><p style="font-size:13px;margin-top:6px">Belum ada antrian untuk kategori ini.</p></div>';
    return;
  }

  el.innerHTML = filtered.map(x => {
    let statusClass = 'lencana';
    if(x.status === 'Sudah Dibaca') statusClass += ' baca';
    else if(x.status === 'Cancel') statusClass += ' batal';

    return `<article class="gelembung">
      <div class="kepala">
        <div class="avatar">${aman((x.detail || '?').trim().charAt(0).toUpperCase())}</div>
        <span class="nama-p">${aman(x.detail)}</span>
        ${x.tipe === 'Fast Track' ? '<span class="lencana kilat">⚡ Fast Track</span>' : ''}
        <span class="${statusClass}">${aman(x.status)}</span>
        <span class="waktu">${kapan(Number(x.ts))}</span>
      </div>
    </article>`;
  }).join('');
}

/* ══════ LOGIN ADMIN ══════ */
let isLoggedAdmin = false;
$('#form-login').addEventListener('submit', e => {
  e.preventDefault();
  const u = $('#l-nama').value.trim();
  const p = $('#l-pass').value.trim();
  const st = $('#l-status');

  if(u === ADMIN_USER && p === ADMIN_PASS){
    isLoggedAdmin = true;
    $('#jendela-login').style.display = 'none';
    $('#panel-admin').style.display = 'block';
    gambarAdmin();
  } else {
    status(st, 'Username atau Password salah!', 'err');
  }
});

$('#btn-logout').addEventListener('click', () => {
  isLoggedAdmin = false;
  $('#jendela-login').style.display = 'block';
  $('#panel-admin').style.display = 'none';
  $('#form-login').reset();
});

/* ══════ TOGGLE PILLS INPUT ADMIN ══════ */
let tipeAntrianInput = 'Reguler';
$('#btn-tipe-reg').addEventListener('click', () => {
  tipeAntrianInput = 'Reguler';
  $('#btn-tipe-reg').classList.add('aktif');
  $('#btn-tipe-ft').classList.remove('aktif');
});
$('#btn-tipe-ft').addEventListener('click', () => {
  tipeAntrianInput = 'Fast Track';
  $('#btn-tipe-ft').classList.add('aktif');
  $('#btn-tipe-reg').classList.remove('aktif');
});

/* ══════ INPUT ANTRIAN BARU (INSTANT UI UPDATE) ══════ */
$('#form-input').addEventListener('submit', e => {
  e.preventDefault();
  const detail = $('#i-detail').value.trim();
  const st = $('#i-status');

  if(!detail) return status(st, 'Nama dan Jumlah Order harus diisi.', 'err');

  const itemBaru = {
    action: 'ADD',
    id: 'q_' + Date.now(),
    detail: detail,
    tipe: tipeAntrianInput,
    status: 'Belum Dibaca',
    ts: Date.now()
  };

  // 1. Langsung masukkan & tampilkan di layar seketika (tanpa menunggu server)
  dAntrian.unshift(itemBaru);
  gambarAntrian();
  gambarAdmin();

  // 2. Kosongkan input & berikan notif sukses kilat
  $('#i-detail').value = '';
  status(st, 'Berhasil ditambahkan! ♡', 'ok');

  // 3. Kirim ke Google Spreadsheet di background secara senyap
  kirimKeSpreadsheetBg(itemBaru);
});

/* ══════ RENDER KELOLA ANTRIAN & LAPORAN HARIAN (ADMIN) ══════ */
let cariAdminTeks = '';
$('#cari-admin').addEventListener('input', e => {
  cariAdminTeks = e.target.value.trim().toLowerCase();
  gambarAdmin();
});

function gambarAdmin(){
  if(!isLoggedAdmin) return;
  
  renderLaporanTgl();

  const el = $('#feed-admin');
  let data = dAntrian;

  if(cariAdminTeks){
    data = data.filter(x => x.detail.toLowerCase().includes(cariAdminTeks));
  }

  if(!data.length){
    el.innerHTML = '<div class="kosong"><div class="em">📋</div><div class="j">belum ada data</div></div>';
    return;
  }

  el.innerHTML = data.map(x => {
    const isBelum = x.status === 'Belum Dibaca' ? 'sel-belum' : '';
    const isSudah = x.status === 'Sudah Dibaca' ? 'sel-sudah' : '';
    const isCancel = x.status === 'Cancel' ? 'sel-cancel' : '';

    return `<article class="gelembung">
      <div class="kepala">
        <div class="avatar">${aman((x.detail || '?').trim().charAt(0).toUpperCase())}</div>
        <span class="nama-p">${aman(x.detail)}</span>
        <span class="lencana kilat">${aman(x.tipe)}</span>
        <span class="waktu">${kapan(Number(x.ts))}</span>
      </div>
      <div class="alat">
        <div class="pills-status">
          <button class="pill-opt ${isBelum}" onclick="ubahStatusTarot('${x.id}', 'Belum Dibaca')">Belum</button>
          <button class="pill-opt ${isSudah}" onclick="ubahStatusTarot('${x.id}', 'Sudah Dibaca')">Sudah</button>
          <button class="pill-opt ${isCancel}" onclick="ubahStatusTarot('${x.id}', 'Cancel')">Cancel</button>
        </div>
        <button class="btn-hapus" onclick="hapusAntrian('${x.id}')">Hapus</button>
      </div>
    </article>`;
  }).join('');
}

function renderLaporanTgl(){
  const tbody = $('#tabel-laporan-body');
  if(!dAntrian.length){
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--tinta-muda)">Belum ada data antrian</td></tr>';
    return;
  }

  const rekap = {};
  dAntrian.forEach(x => {
    const tglNum = Number(x.ts);
    const tgl = !isNaN(tglNum) ? new Date(tglNum).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Hari Ini';
    if(!rekap[tgl]){
      rekap[tgl] = { total: 0, sudah: 0, belum: 0 };
    }
    rekap[tgl].total++;
    if(x.status === 'Sudah Dibaca') rekap[tgl].sudah++;
    else if(x.status === 'Belum Dibaca') rekap[tgl].belum++;
  });

  tbody.innerHTML = Object.keys(rekap).map(tgl => {
    const r = rekap[tgl];
    return `<tr>
      <td><strong>${tgl}</strong></td>
      <td>${r.total} order</td>
      <td style="color:#5c8a68;font-weight:600">${r.sudah}</td>
      <td style="color:#b58146;font-weight:600">${r.belum}</td>
    </tr>`;
  }).join('');
}

// Ubah Status Seketika (Tanpa Loading)
window.ubahStatusTarot = function(id, val){
  const idx = dAntrian.findIndex(x => x.id === id);
  if(idx !== -1){
    dAntrian[idx].status = val;
    gambarAntrian();
    gambarAdmin();
    kirimKeSpreadsheetBg({ action: 'UPDATE_STATUS', id, status: val });
  }
};

// Hapus Antrian Seketika (Tanpa Loading)
window.hapusAntrian = function(id){
  if(!confirm('Yakin mau hapus antrian ini?')) return;
  dAntrian = dAntrian.filter(x => x.id !== id);
  gambarAntrian();
  gambarAdmin();
  kirimKeSpreadsheetBg({ action: 'DELETE', id });
};

// Panggil pertama kali saat halaman dibuka
muatAntrianServer();
</script>
