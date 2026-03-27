
const counts = {};
const MAX = 10;
const MIN = 6;

// ── DOM REFS ──
const cards     = document.querySelectorAll('.flower-card');
const pillsWrap = document.getElementById('pillsWrap');
const nextBtn   = document.getElementById('nextBtn');
const hintEl    = document.getElementById('bouquetHint');

// ── TOTAL SELECTED ──
function totalSelected() {
  return Object.values(counts).reduce((a, b) => a + b, 0);
}

// ── ADD ONE OF A FLOWER ──
function addFlower(name) {
  const total = totalSelected();
  if (total >= MAX) return;
  counts[name] = (counts[name] || 0) + 1;
  refresh();
}

// ── REMOVE ONE OF A FLOWER ──
function removeFlower(name) {
  if (!counts[name] || counts[name] === 0) return;
  counts[name]--;
  if (counts[name] === 0) delete counts[name];
  refresh();
}

// ── REFRESH UI ──
function refresh() {
  const total = totalSelected();

  // Update each card badge + selected class
  cards.forEach(card => {
    const name  = card.dataset.flower;
    const count = counts[name] || 0;
    const badge = card.querySelector('.badge');
    const img   = card.querySelector('.flower-img-wrap img');

    // Badge
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }

    // Selected state
    if (count > 0) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }

    // Dim cards that can't be added (at max)
    if (total >= MAX && count === 0) {
      img.style.opacity = '.45';
    } else {
      img.style.opacity = '1';
    }
  });

  // Rebuild pills
  pillsWrap.innerHTML = '';
  Object.entries(counts).forEach(([name, count]) => {
    if (count <= 0) return;
    const pill = document.createElement('button');
    pill.className = 'pill';
    pill.textContent = `${name.toUpperCase()} x${count}`;
    pill.title = `Click to remove one ${name}`;
    pill.addEventListener('click', () => removeFlower(name));
    pillsWrap.appendChild(pill);
  });

  // Hint text
  if (total === 0) {
    hintEl.textContent = "Click on a flower's name to deselect it.";
  } else if (total < MIN) {
    hintEl.textContent = `${total} selected — pick at least ${MIN - total} more`;
  } else if (total === MAX) {
    hintEl.textContent = `${total} selected — maximum reached. Click a pill to remove.`;
  } else {
    hintEl.textContent = `${total} selected — click a flower's name to remove one.`;
  }

  // Next button
  nextBtn.disabled = total < MIN;
}

// ── ATTACH CLICK EVENTS ──
cards.forEach(card => {
  const name    = card.dataset.flower;
  const imgWrap = card.querySelector('.flower-img-wrap');
  const nameEl  = card.querySelector('.flower-name');

  // Click on image → ADD
  imgWrap.addEventListener('click', (e) => {
    e.stopPropagation();
    addFlower(name);
  });

  // Click on name → REMOVE ONE
  nameEl.addEventListener('click', (e) => {
    e.stopPropagation();
    removeFlower(name);
  });
});

// ── GO TO PREVIEW ──
function goToPreview() {
  if (totalSelected() < MIN) return;

  const flowerList = [];
  Object.entries(counts).forEach(([name, count]) => {
    for (let i = 0; i < count; i++) flowerList.push(name);
  });

  const params = new URLSearchParams();
  params.set('flowers', flowerList.join(','));
  window.location.href = `preview.html?${params.toString()}`;
}

// ── INIT ──
refresh();
