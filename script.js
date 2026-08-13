const $ = s => document.querySelector(s);
const hemat = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hp = window.matchMedia('(max-width: 720px)').matches;

/* ════════════════════════════════════════════════════════════════
   KONFIGURASI SPREADSHEET & LOGIN ADMIN
   ════════════════════════════════════════════════════════════════ */
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'bintang';

// Masukkan Web App URL dari Google Apps Script jika sudah ada
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

/* ══════ PENYIMPANAN LOCAL & SPREADSHEET SYNC ══════ */
const KUNCI_ANTRIAN = 'leony_tarot:antrian';
let dAntrian = [];

function simpanAntrianLocal(data){
  dAntrian = data;
  localStorage.setItem(KUNCI_ANTRIAN, JSON.stringify(data));
  gambarAntrian();
  gambarAdmin();
}

async function syncToSpreadsheet(action, payload) {
  if(!GOOGLE_SCRIPT_URL) return;
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload })
    });
  } catch(e) {
    console.error("Gagal sync ke Spreadsheet:", e);
  }
}

// Fungsi Batch Request dikirim senyap di background
async function syncBatchToSpreadsheet(items) {
  if(!GOOGLE_SCRIPT_URL) return;
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'ADD_BATCH', items: items })
    });
  } catch(e) {
    console.error("Gagal sync batch ke Spreadsheet:", e);
  }
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
  if(jenis === 'ok') setTimeout(() => el.className = 'pesan-status', 5200);
}

/* ══════ NAVIGASI UTAMA ══════ */
const tabs = document.querySelectorAll('.tab');
function keHalaman(nama){
  document.querySelectorAll('.hal').forEach(h => h.classList.toggle('aktif', h.id === 'hal-' + nama));
  tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.hal === nama)));
  scrollTo({top:0, behavior:'smooth'});
}
tabs.forEach(t => t.addEventListener('click', () => keHalaman(t.dataset.hal)));

/* ══════ SUB-TABS ANTRIAN CUSTOMER ══════ */
let tipeSubTabAktif = 'Reguler';
$('#tab-reguler').addEventListener('click', () => {
  tipeSubTabAktif = 'Reguler';
  $('#tab-reguler').classList.add('aktif');
  $('#tab-fasttrack').classList.remove('aktif');
  gambarAntrian();
});
$('#tab-fasttrack').addEventListener('click', () => {
  tipeSubTabAktif = 'Fast Track';
  $('#tab-fasttrack').classList.add('aktif');
  $('#tab-reguler').classList.remove('aktif');
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
  let filtered = dAntrian.filter(x => x.tipe === tipeSubTabAktif);
  
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

/* ══════ MULTI-INPUT HELPER ══════ */
function bindPillsEvents(parentEl) {
  const btnReg = parentEl.querySelector('.btn-reg');
  const btnFt = parentEl.querySelector('.btn-ft');
  const inputVal = parentEl.querySelector('.i-tipe-val');

  btnReg.addEventListener('click', () => {
    inputVal.value = 'Reguler';
    btnReg.classList.add('aktif');
    btnFt.classList.remove('aktif');
  });
  btnFt.addEventListener('click', () => {
    inputVal.value = 'Fast Track';
    btnFt.classList.add('aktif');
    btnReg.classList.remove('aktif');
  });
}
bindPillsEvents($('.baris-input-item'));

$('#btn-tambah-baris').addEventListener('click', () => {
  const container = $('#container-multi-input');
  const divBaru = document.createElement('div');
  divBaru.className = 'baris-input-item baris';
  divBaru.style.cssText = 'align-items: flex-end; animation: masuk .3s ease both;';
  divBaru.innerHTML = `
    <div>
      <label for="i-detail">Nama &amp; Jumlah Order</label>
      <input type="text" class="i-detail" placeholder="Anisa 10k" required>
    </div>
    <div style="display: flex; gap: 8px; align-items: flex-end;">
      <div style="flex: 1;">
        <label>Status Tipe Antrian</label>
        <div class="pills-tipe-input">
          <button type="button" class="pill-tipe-opt aktif btn-reg">Reguler</button>
          <button type="button" class="pill-tipe-opt btn-ft">⚡ Fast Track</button>
        </div>
        <input type="hidden" class="i-tipe-val" value="Reguler">
      </div>
      <button type="button" class="mini btn-hapus-baris" style="height:47px; color:#a9526f;" title="Hapus baris">✕</button>
    </div>
  `;
  bindPillsEvents(divBaru);
  divBaru.querySelector('.btn-hapus-baris').addEventListener('click', () => {
    divBaru.remove();
  });
  container.appendChild(divBaru);
});

/* ══════ INPUT ANTRIAN BARU (ADMIN) - OPTIMISTIC UI (INSTAN TANPA LOADING) ══════ */
$('#form-input').addEventListener('submit', async e => {
  e.preventDefault();
  const st = $('#i-status');

  const items = document.querySelectorAll('.baris-input-item');
  if(!items.length) return status(st, 'Minimal isi 1 antrian.', 'err');

  let timestampBase = Date.now();
  let listBaru = [];

  items.forEach((el, index) => {
    const detail = el.querySelector('.i-detail').value.trim();
    const tipe = el.querySelector('.i-tipe-val').value;
    if(detail) {
      listBaru.push({
        id: 'q_' + (timestampBase + index),
        detail: detail,
        tipe: tipe,
        status: 'Belum Dibaca',
        ts: timestampBase + index
      });
    }
  });

  if(!listBaru.length){
    return status(st, 'Semua field nama masih kosong!', 'err');
  }

  // 1. UPDATE UI & LOCALSTORAGE SEKETIKA (Tanpa jeda loading sama sekali!)
  dAntrian = [...listBaru.reverse(), ...dAntrian];
  simpanAntrianLocal(dAntrian);

  // Reset form input langsung supaya admin bisa ngetik lagi dengan cepat
  $('#container-multi-input').innerHTML = `
    <div class="baris-input-item baris" style="align-items: flex-end;">
      <div>
        <label for="i-detail">Nama &amp; Jumlah Order</label>
        <input type="text" class="i-detail" placeholder="Anisa 10k" required>
      </div>
      <div style="display: flex; gap: 8px; align-items: flex-end;">
        <div style="flex: 1;">
          <label>Status Tipe Antrian</label>
          <div class="pills-tipe-input">
            <button type="button" class="pill-tipe-opt aktif btn-reg">Reguler</button>
            <button type="button" class="pill-tipe-opt btn-ft">⚡ Fast Track</button>
          </div>
          <input type="hidden" class="i-tipe-val" value="Reguler">
        </div>
        <button type="button" class="mini btn-hapus-baris" style="display:none; height:47px; color:#a9526f;">✕</button>
      </div>
    </div>
  `;
  bindPillsEvents($('.baris-input-item'));
  status(st, `Berhasil menambahkan ${listBaru.length} antrian secara instan! ♡`, 'ok');

  // 2. KIRIM KE SPREADSHEET DI BELAKANG LAYAR (Background process)
  await syncBatchToSpreadsheet(listBaru);
});

/* ══════ RENDER KELOLA ANTRIAN (ADMIN) ══════ */
let cariAdminTeks = '';
$('#cari-admin').addEventListener('input', e => {
  cariAdminTeks = e.target.value.trim().toLowerCase();
  gambarAdmin();
});

function gambarAdmin(){
  if(!isLoggedAdmin) return;
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
    return `<article class="gelembung">
      <div class="kepala">
        <div class="avatar">${aman((x.detail || '?').trim().charAt(0).toUpperCase())}</div>
        <span class="nama-p">${aman(x.detail)}</span>
        <span class="lencana kilat">${aman(x.tipe)}</span>
        <span class="waktu">${kapan(Number(x.ts))}</span>
      </div>
      <div class="alat">
        <label style="font-size:11px;margin:0;color:var(--tinta-muda)">Status Tarot:</label>
        <select class="mini-select" data-id="${x.id}" onchange="ubahStatusTarot('${x.id}', this.value)">
          <option value="Belum Dibaca" ${x.status === 'Belum Dibaca' ? 'selected' : ''}>Belum Dibaca</option>
          <option value="Sudah Dibaca" ${x.status === 'Sudah Dibaca' ? 'selected' : ''}>Sudah Dibaca</option>
          <option value="Cancel" ${x.status === 'Cancel' ? 'selected' : ''}>Cancel</option>
        </select>
        <button class="mini" onclick="hapusAntrian('${x.id}')" style="color:#a9526f;margin-left:auto">Hapus</button>
      </div>
    </article>`;
  }).join('');
}

window.ubahStatusTarot = async function(id, val){
  const idx = dAntrian.findIndex(x => x.id === id);
  if(idx !== -1){
    dAntrian[idx].status = val;
    simpanAntrianLocal(dAntrian); // Instan di UI
    await syncToSpreadsheet('UPDATE_STATUS', { id, status: val }); // Background process
  }
};

window.hapusAntrian = async function(id){
  if(!confirm('Yakin mau hapus antrian ini?')) return;
  dAntrian = dAntrian.filter(x => x.id !== id);
  simpanAntrianLocal(dAntrian); // Instan di UI
  await syncToSpreadsheet('DELETE', { id }); // Background process
};

async function muatAntrianServer(){
  if(GOOGLE_SCRIPT_URL){
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL);
      const dataServer = await res.json();
      if(Array.isArray(dataServer) && dataServer.length > 0){
        dAntrian = dataServer;
        localStorage.setItem(KUNCI_ANTRIAN, JSON.stringify(dAntrian));
        gambarAntrian();
        gambarAdmin();
        return;
      }
    } catch(e) {
      console.error("Gagal ambil dari server, pakai cache lokal:", e);
    }
  }

  const local = localStorage.getItem(KUNCI_ANTRIAN);
  if(local){
    try { dAntrian = JSON.parse(local); } catch(e){ dAntrian = []; }
  } else {
    dAntrian = [
      { id:'1', detail:'Alya - 1 Order', tipe:'Fast Track', status:'Belum Dibaca', ts:Date.now() - 3600000 },
      { id:'2', detail:'Nadia - 2 Order', tipe:'Reguler', status:'Belum Dibaca', ts:Date.now() - 7200000 },
      { id:'3', detail:'Risa - 1 Order', tipe:'Reguler', status:'Sudah Dibaca', ts:Date.now() - 10800000 }
    ];
  }
  gambarAntrian();
  gambarAdmin();
}

muatAntrianServer();
