// 좌측 버튼 / 우측 패널(하위 탭 + 아이템 그리드) UI
import * as D from './data.js';
import { url } from './data.js';

const MENU = [
  {
    id: 'wardrobe', icon: '👗', label: '옷장', tabs: [
      { label: '드레스', slot: 'dress', type: 'img', items: D.DRESSES, none: false, crop: 'full' },
      { label: '머리', slot: 'hair', type: 'hair', items: D.HAIRS, none: false, crop: 'full' },
      { label: '신발', slot: 'shoes', type: 'img', items: D.SHOES, none: true, crop: 'feet' },
      { label: '면사포', slot: 'headwear', type: 'svg', items: D.HEADWEAR, none: false, crop: 'head' },
    ],
  },
  {
    id: 'drawer', icon: '💍', label: '서랍장', tabs: [
      { label: '목걸이', slot: 'necklace', type: 'img', items: D.NECKLACES, none: true, crop: 'chest' },
      { label: '귀걸이', slot: 'earrings', type: 'img', items: D.EARRINGS, none: true, crop: 'head' },
      { label: '반지·팔찌', slot: 'hands', type: 'img', items: D.HANDS, none: true, crop: 'hands' },
    ],
  },
  {
    id: 'face', icon: '💄', label: '페이스페인팅', tabs: [
      { label: '눈', slot: 'eyes', type: 'img', items: D.EYES, none: false, crop: 'head' },
      { label: '눈썹', slot: 'eyebrows', type: 'img', items: D.EYEBROWS, none: true, crop: 'head' },
      { label: '속눈썹', slot: 'eyelashes', type: 'img', items: D.EYELASHES, none: true, crop: 'head' },
      { label: '입술', slot: 'mouth', type: 'img', items: D.MOUTHS, none: false, crop: 'head' },
      { label: '볼터치', slot: 'blush', type: 'img', items: D.BLUSH, none: true, crop: 'head' },
    ],
  },
  { id: 'prince', icon: '🤴', label: '왕자', action: 'prince' },
];

// 썸네일 확대(crop) 프리셋: cell 안에서 어느 부위를 보여줄지
const CELL = 86;
const CROPS = {
  full: { scale: 1, fy: 0.5 },
  head: { scale: 3.4, fy: 0.2 },
  chest: { scale: 2.6, fy: 0.33 },
  hands: { scale: 2.4, fy: 0.46 },
  feet: { scale: 3.0, fy: 0.9 },
};

function cropStyle(el, crop) {
  const c = CROPS[crop] || CROPS.full;
  const h = CELL * c.scale;
  const w = h * (800 / 1200);
  el.style.height = h + 'px';
  el.style.width = w + 'px';
  el.style.left = '50%';
  el.style.top = (CELL / 2 - c.fy * h) + 'px';
  el.style.transform = 'translateX(-50%)';
}

export function buildUI({ doll, sound, onPrince, onChange }) {
  const buttonsEl = document.getElementById('buttons');
  const tabsEl = document.getElementById('tabs');
  const gridEl = document.getElementById('grid');

  let activeCat = null;

  // 좌측 메인 버튼
  for (const cat of MENU) {
    const btn = document.createElement('button');
    btn.className = 'mainbtn';
    btn.innerHTML = `<span class="ic">${cat.icon}</span><span class="lb">${cat.label}</span>`;
    btn.addEventListener('click', () => {
      if (cat.action === 'prince') { onPrince(); return; }
      selectCategory(cat, btn);
    });
    btn.dataset.id = cat.id;
    buttonsEl.appendChild(btn);
  }

  function selectCategory(cat, btn) {
    activeCat = cat;
    [...buttonsEl.children].forEach((b) => b.classList.toggle('active', b.dataset.id === cat.id));
    tabsEl.innerHTML = '';
    cat.tabs.forEach((tab, i) => {
      const t = document.createElement('button');
      t.className = 'tab';
      t.textContent = tab.label;
      t.addEventListener('click', () => selectTab(cat, tab, t));
      tabsEl.appendChild(t);
      if (i === 0) selectTab(cat, tab, t);
    });
  }

  function selectTab(cat, tab, tabBtn) {
    [...tabsEl.children].forEach((b) => b.classList.toggle('active', b === tabBtn));
    renderGrid(tab);
  }

  function renderGrid(tab) {
    gridEl.innerHTML = '';
    if (tab.none) {
      gridEl.appendChild(makeNoneCell(tab));
    }
    tab.items.forEach((item) => {
      if (tab.type === 'svg' && item.key === 'none') {
        gridEl.appendChild(makeNoneCell(tab, item));
        return;
      }
      gridEl.appendChild(makeCell(tab, item));
    });
  }

  function clearSelected() {
    [...gridEl.children].forEach((c) => c.classList.remove('selected'));
  }

  function makeCell(tab, item) {
    const cell = document.createElement('button');
    cell.className = 'cell';
    const view = document.createElement('div');
    view.className = 'view';

    if (tab.type === 'img') {
      const img = document.createElement('img');
      img.src = url(item);
      img.alt = '';
      cropStyle(img, tab.crop);
      view.appendChild(img);
    } else if (tab.type === 'hair') {
      const img = document.createElement('img');
      img.src = url(item.back);
      img.alt = '';
      cropStyle(img, tab.crop);
      view.appendChild(img);
    } else if (tab.type === 'svg') {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 800 1200');
      svg.innerHTML = item.svg;
      cropStyle(svg, 'head');
      view.appendChild(svg);
    }

    cell.appendChild(view);
    cell.addEventListener('click', () => {
      clearSelected();
      cell.classList.add('selected');
      apply(tab, item);
    });
    return cell;
  }

  function makeNoneCell(tab, svgItem) {
    const cell = document.createElement('button');
    cell.className = 'cell none';
    cell.innerHTML = '<span>없음</span>';
    cell.addEventListener('click', () => {
      clearSelected();
      cell.classList.add('selected');
      if (tab.type === 'svg') {
        doll.setHeadwear('none');
      } else {
        doll.set(tab.slot, null);
      }
      sound.playSelect();
      onChange && onChange(tab.slot, null);
    });
    return cell;
  }

  function apply(tab, item) {
    if (tab.type === 'img') doll.set(tab.slot, item);
    else if (tab.type === 'hair') doll.setHair(item);
    else if (tab.type === 'svg') doll.setHeadwear(item.key);
    sound.playSelect();
    onChange && onChange(tab.slot, item);
  }

  // 처음엔 옷장 열어두기
  selectCategory(MENU[0], buttonsEl.querySelector('[data-id="wardrobe"]'));
}
