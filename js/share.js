const params   = new URLSearchParams(window.location.search);
const isShared = params.get('shared') === 'true';
const flowers  = params.get('flowers') ? params.get('flowers').split(',') : [];
const bush     = parseInt(params.get('bush') || '0');
const from     = params.get('from') || '';
const to       = params.get('to')   || '';
const msg      = params.get('msg')  || '';

// If no flowers, go home
if (flowers.length === 0) {
  window.location.href = 'index.html';
}

// ── APPS SCRIPT URL ──
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxPqrNqNEdE26H-zRMvbPMy_IBUkla3pTDflJL2w_RwsnLTT3f35IBOVM4eamMI1fUX/exec';

// ── BUSH LIST ──
const BUSH_BASE = 'https://pub-4ac1b7f0da8c43e8983d7821a18a8c0d.r2.dev/color/bush/';
const bushList  = [
  `${BUSH_BASE}bush-1.png`,
  `${BUSH_BASE}bush-2.png`,
  `${BUSH_BASE}bush-3.png`,
];

// ── BOUQUET POSITIONS ──
const allPositions = [
  { x: 36, y: 10 },
  { x: 16, y: 18 },
  { x: 55, y: 14 },
  { x: 25, y: 35 },
  { x: 44, y: 30 },
  { x: 60, y: 35 },
  { x: 12, y: 48 },
  { x: 36, y: 48 },
  { x: 58, y: 50 },
  { x: 24, y: 58 },
];

// ── RENDER DEDICATION ──
function renderDedication() {
  const el = document.getElementById('shareDedication');
  if (!to && !from) { el.style.display = 'none'; return; }
  let html = '';
  if (to)   html += `<p class="to-text">For ${to}</p>`;
  if (from) html += `<p class="from-text">from ${from}</p>`;
  el.innerHTML = html;
}

// ── RENDER MESSAGE ──
function renderMessage() {
  const el = document.getElementById('shareMessage');
  if (!msg) { el.style.display = 'none'; return; }
  const safe = msg
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br/>');
  el.innerHTML = `<p>"${safe}"</p>`;
}

// ── RENDER BUSH ──
function renderBush() {
  const safeIndex = bush % bushList.length;
  document.getElementById('bushLayer').innerHTML =
    `<img src="${bushList[safeIndex]}" alt="bush"/>`;
}

// ── RENDER BOUQUET ──
function renderBouquet() {
  const layer    = document.getElementById('flowersLayer');
  layer.innerHTML = '';
  const seed     = flowers.join('').length;
  const shuffled = [...allPositions].sort((a, b) =>
    ((a.x * seed) % 7) - ((b.x * seed) % 7)
  );
  flowers.forEach((flower, i) => {
    const pos      = shuffled[i];
    const rotation = ((flower.charCodeAt(0) + i) % 25) - 12;
    const delay    = i * 0.07;
    const img      = document.createElement('img');
    const FLOWER_BASE = 'https://pub-4ac1b7f0da8c43e8983d7821a18a8c0d.r2.dev/color/flowers/';
    img.src                = `${FLOWER_BASE}${flower}.webp`;
    img.alt                = flower;
    img.className          = 'bouquet-flower';
    img.style.left         = `${pos.x}%`;
    img.style.top          = `${pos.y}%`;
    img.style.transform    = `rotate(${rotation}deg)`;
    img.style.animationDelay = `${delay}s`;
    img.style.zIndex       = i + 1;
    layer.appendChild(img);
  });
}

// ── SEND TO GOOGLE SHEETS ──
async function sendToSheets() {
  const btn = document.getElementById('shareBtn');

  // Prevent duplicate submissions
  if (btn.dataset.sent === 'true') {
    copyLink();
    return;
  }

  btn.textContent = '';
  btn.disabled    = true;

  try {
    const formData = new FormData();
    formData.append('to',      to      || '(not set)');
    formData.append('from',    from    || '(not set)');
    formData.append('message', msg     || '(no message)');
    formData.append('flowers', flowers.join(', '));

    await fetch(SCRIPT_URL, {
      method: 'POST',
      body:   formData,
      mode:   'no-cors'
    });

    btn.dataset.sent = 'true';
    btn.textContent  = '';
    btn.disabled     = false;
    copyLink();

  } catch (err) {
    console.error('Sheet error:', err);
    btn.textContent = 'Copy Link to Share 🌸';
    btn.disabled    = false;
    copyLink();
  }
}

// ── COPY LINK ──
function copyLink() {
  const url = new URL(window.location.href);
  url.searchParams.set('shared', 'true');

  navigator.clipboard.writeText(url.toString()).then(() => {
    const copiedMsg = document.getElementById('copiedMsg');
    copiedMsg.classList.add('visible');
    setTimeout(() => copiedMsg.classList.remove('visible'), 3000);
  }).catch(() => {
    const input = document.createElement('input');
    input.value = url.toString();
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    const copiedMsg = document.getElementById('copiedMsg');
    copiedMsg.classList.add('visible');
    setTimeout(() => copiedMsg.classList.remove('visible'), 3000);
  });
}

// ── HANDLE SHARED MODE ──
function handleShareMode() {
  if (isShared) {
    const actions = document.querySelector('.share-actions');
    if (actions) actions.style.display = 'none';
  }
}

// ── INIT ──
renderDedication();
renderMessage();
renderBush();
renderBouquet();
handleShareMode();
renderMessage();
renderBush();
renderBouquet();
handleShareMode();
