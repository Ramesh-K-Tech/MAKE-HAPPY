const params  = new URLSearchParams(window.location.search);
const isShared = params.get('shared') === 'true';
const flowers = params.get('flowers') ? params.get('flowers').split(',') : [];
const bush    = parseInt(params.get('bush') || '0');
const from    = params.get('from') || '';
const to      = params.get('to')   || '';
const msg     = params.get('msg')  || '';

// If no flowers, go home
if (flowers.length === 0) {
  window.location.href = 'index.html';
}


// ── BUSH LIST ──
// ── BUSH LIST (ONLINE CDN) ──
const BUSH_BASE = 'https://pub-4ac1b7f0da8c43e8983d7821a18a8c0d.r2.dev/color/bush/';

const bushList = [
  `${BUSH_BASE}bush-1.png`,
  `${BUSH_BASE}bush-2.png`,
  `${BUSH_BASE}bush-3.png`,
];

// ── BOUQUET POSITIONS (same as preview.js) ──
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

  if (!to && !from) {
    el.style.display = 'none';
    return;
  }

  let html = '';
  if (to)   html += `<p class="to-text">For ${to}</p>`;
  if (from) html += `<p class="from-text">from ${from}</p>`;
  el.innerHTML = html;
}


// ── RENDER MESSAGE ──
function renderMessage() {
  const el = document.getElementById('shareMessage');

  if (!msg) {
    el.style.display = 'none';
    return;
  }

  // Sanitize message to prevent XSS
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
  const layer = document.getElementById('flowersLayer');
  layer.innerHTML = '';

  // Deterministic shuffle using flower names as seed
  const seed     = flowers.join('').length;
  const shuffled = [...allPositions].sort((a, b) =>
    ((a.x * seed) % 7) - ((b.x * seed) % 7)
  );

  flowers.forEach((flower, i) => {
    const pos      = shuffled[i];
    // Deterministic rotation so same link = same look
    const rotation = ((flower.charCodeAt(0) + i) % 25) - 12;
    const delay    = i * 0.07;

    const img               = document.createElement('img');
    const FLOWER_BASE = 'https://pub-4ac1b7f0da8c43e8983d7821a18a8c0d.r2.dev/color/flowers/';

img.src = `${FLOWER_BASE}${flower}.webp`;
    img.alt                 = flower;
    img.className           = 'bouquet-flower';
    img.style.left          = `${pos.x}%`;
    img.style.top           = `${pos.y}%`;
    img.style.transform     = `rotate(${rotation}deg)`;
    img.style.animationDelay = `${delay}s`;
    img.style.zIndex        = i + 1;

    layer.appendChild(img);
  });
}


// ── COPY LINK ──
function copyLink() {
  const url = new URL(window.location.href);

  // ✅ Add shared flag
  url.searchParams.set('shared', 'true');

  navigator.clipboard.writeText(url.toString()).then(() => {
    const msg = document.getElementById('copiedMsg');
    msg.classList.add('visible');
    setTimeout(() => msg.classList.remove('visible'), 3000);
  }).catch(() => {
    // Fallback for older browsers
    const input = document.createElement('input');
    input.value = url.toString(); // ✅ important
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);

    const copiedMsg = document.getElementById('copiedMsg');
    copiedMsg.classList.add('visible');
    setTimeout(() => copiedMsg.classList.remove('visible'), 3000);
  });
}
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
