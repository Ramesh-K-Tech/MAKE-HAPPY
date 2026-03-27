// ============================================
//  MESSAGE.JS
//  - Reads flowers + bush from URL
//  - Character counter for textarea
//  - Passes flowers + bush + from + to + msg
//    to share.html via URL params
// ============================================


// ── READ PARAMS FROM URL ──
const params  = new URLSearchParams(window.location.search);
const flowers = params.get('flowers') || '';
const bush    = params.get('bush')    || '0';

// If no flowers, go back
if (!flowers) {
  window.location.href = 'bouquet.html';
}

// ── BACK BUTTON — preserve params ──
document.getElementById('backBtn').href =
  `preview.html?flowers=${flowers}&bush=${bush}`;


// ── CHARACTER COUNTER ──
const textarea  = document.getElementById('msgField');
const charCount = document.getElementById('charCount');

textarea.addEventListener('input', () => {
  const len = textarea.value.length;
  charCount.textContent = `${len} / 300`;

  // Turn red when near limit
  if (len >= 280) {
    charCount.style.color = '#c0392b';
  } else {
    charCount.style.color = '#aaa';
  }
});


// ── GO TO SHARE PAGE ──
function goToShare() {
  const from = document.getElementById('fromField').value.trim();
  const to   = document.getElementById('toField').value.trim();
  const msg  = textarea.value.trim();

  // Build URL params
  const p = new URLSearchParams();
  p.set('flowers', flowers);
  p.set('bush',    bush);
  if (from) p.set('from', from);
  if (to)   p.set('to',   to);
  if (msg)  p.set('msg',  msg);

  window.location.href = `share.html?${p.toString()}`;
}
