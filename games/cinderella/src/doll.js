// 종이인형 레이어 렌더링/교체 엔진
import { url, BODY, UNDER_BOTTOM, UNDER_TOP, HEADWEAR } from './data.js';

// 아래 → 위 (z-order) 레이어 순서
export const LAYER_ORDER = [
  'hairBack',
  'body',
  'underBottom',
  'underTop',
  'dress',
  'shoes',
  'eyes',
  'eyebrows',
  'eyelashes',
  'mouth',
  'blush',
  'hairBangs',
  'necklace',
  'earrings',
  'hands',
  'headwear',
];

// 항상 켜져 있는 고정 레이어
const FIXED = {
  body: BODY,
  underBottom: UNDER_BOTTOM,
  underTop: UNDER_TOP,
};

export class Doll {
  constructor(stageEl) {
    this.stage = stageEl;
    this.layers = {};
    this.state = {};

    for (const name of LAYER_ORDER) {
      if (name === 'headwear') {
        const div = document.createElement('div');
        div.className = 'layer headwear';
        div.innerHTML = '<svg viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg"></svg>';
        this.stage.appendChild(div);
        this.layers[name] = div;
      } else {
        const img = document.createElement('img');
        img.className = 'layer';
        img.alt = '';
        img.draggable = false;
        this.stage.appendChild(img);
        this.layers[name] = img;
      }
    }

    // 고정 레이어 적용
    for (const [name, path] of Object.entries(FIXED)) {
      this.layers[name].src = url(path);
    }
  }

  // path === null 이면 해당 슬롯 비우기
  set(slot, path) {
    this.state[slot] = path;
    const el = this.layers[slot];
    if (!el) return;
    if (path) {
      el.src = url(path);
      el.style.display = '';
    } else {
      el.removeAttribute('src');
      el.style.display = 'none';
    }
  }

  // 머리 세트(앞+뒤) 동시 적용
  setHair(hair) {
    this.state.hair = hair;
    this.layers.hairBack.src = url(hair.back);
    this.layers.hairBack.style.display = '';
    this.layers.hairBangs.src = url(hair.bangs);
    this.layers.hairBangs.style.display = '';
  }

  // 면사포/왕관 (SVG)
  setHeadwear(key) {
    this.state.headwear = key;
    const item = HEADWEAR.find((h) => h.key === key) || HEADWEAR[0];
    const svg = this.layers.headwear.querySelector('svg');
    svg.innerHTML = item.svg || '';
  }
}
