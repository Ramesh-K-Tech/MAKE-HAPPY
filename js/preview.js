
const params  = new URLSearchParams(window.location.search);
const flowers = params.get('flowers') ? params.get('flowers').split(',') : [];

if (flowers.length === 0) {
  window.location.href = 'bouquet.html';
}


// ── BUSH OPTIONS ──
// ── BUSH LIST (ONLINE CDN) ──
const BUSH_BASE = 'https://pub-4ac1b7f0da8c43e8983d7821a18a8c0d.r2.dev/color/bush/';

const bushList = [
  `${BUSH_BASE}bush-1.png`,
  `${BUSH_BASE}bush-2.png`,
  `${BUSH_BASE}bush-3.png`,
];
let currentBush = 0;


const allPositions = [
  { x: 36, y: 10 },   // top center
  { x: 16, y: 18 },   // top left
  { x: 55, y: 14 },   // top right
  { x: 25, y: 35 },   // mid left
  { x: 44, y: 30 },   // mid center
  { x: 60, y: 35 },   // mid right
  { x: 12, y: 48 },   // lower left
  { x: 36, y: 48 },   // lower center
  { x: 58, y: 50 },   // lower right
  { x: 24, y: 58 },   // bottom left
];


function renderBush() {
  document.getElementById('bushLayer').innerHTML =
    `<img src="${bushList[currentBush]}" alt="bush"/>`;
}


// ── RENDER FLOWERS ──
function renderBouquet() {
  const layer = document.getElementById('flowersLayer');
  layer.innerHTML = '';

  // Shuffle positions freshly each time
  const shuffled = [...allPositions].sort(() => Math.random() - 0.5);

  flowers.forEach((flower, i) => {
    const pos      = shuffled[i];
    const rotation = (Math.random() * 24) - 12; // -12 to +12 degrees
    const delay    = i * 0.05;

    const img               = document.createElement('img');
    const FLOWER_BASE = 'https://pub-4ac1b7f0da8c43e8983d7821a18a8c0d.r2.dev/color/flowers/';

img.src = `${FLOWER_BASE}${flower}.webp`;
    img.alt                 = flower;
    img.className           = 'bouquet-flower';
    img.style.left          = `${pos.x}%`;
    img.style.top           = `${pos.y}%`;
    img.style.transform     = `rotate(${rotation}deg)`;
    img.style.animationDelay = `${delay}s`;
    // stagger z-index so later flowers appear on top
    img.style.zIndex        = i + 1;

    layer.appendChild(img);
  });
}


// ── TRY NEW ARRANGEMENT ──
function newArrangement() {
  renderBouquet();
}


// ── CHANGE GREENERY ──
function changeGreenery() {
  currentBush = (currentBush + 1) % bushList.length;
  renderBush();
}


// ── GO TO MESSAGE PAGE ──
function goToMessage() {
  const p = new URLSearchParams();
  p.set('flowers', flowers.join(','));
  p.set('bush',    currentBush);
  window.location.href = `message.html?${p.toString()}`;
}


// ── INIT ──
renderBush();
renderBouquet();