// 신데렐라 꾸미기 - 에셋 데이터 정의
// 모든 이미지는 800x1200 동일 캔버스에 위치 정렬되어 있어, 같은 크기로 겹쳐 쌓기만 하면 된다.

export const ASSET = 'assets/';
export function url(p) { return encodeURI(ASSET + p); }

const F = 'Doll outfits(feminine casual)/';
const O = 'Outfits/';
const FA = 'Face elements/';
const B = 'Doll DressUp Assets/';

const range = (n) => Array.from({ length: n }, (_, i) => i + 1);

// 항상 입혀두는 베이스 (맨몸 노출 방지)
export const BODY = B + 'base/base_body_a.png';
export const UNDER_BOTTOM = B + 'underwear/bottom/slip.webp';
export const UNDER_TOP = B + 'underwear/top/bra.webp';

// 옷장 - 드레스
export const DRESSES = [
  ...range(10).map((n) => F + `dress/${n}.webp`),
  ...['1', '2', '3', '3b', '5'].map((n) => O + `dress/${n}.png`),
];

// 옷장 - 머리 (앞머리 + 뒷머리 한 세트)
export const HAIRS = range(10).map((n) => ({
  bangs: F + `hair (bangs)/${n}.webp`,
  back: F + `hair (back)/${n}a.webp`,
}));

// 옷장 - 신발
export const SHOES = [
  ...range(10).map((n) => F + `shoes/${n}.webp`),
  ...range(9).map((n) => O + `shoes/${n}.png`),
];

// 서랍장 - 쥬얼리
export const NECKLACES = ['long necklace', 'pearls necklace', 'small necklace'].map((s) => F + `jewelery/${s}.webp`);
export const EARRINGS = ['ear rings', 'pearls ears'].map((s) => F + `jewelery/${s}.webp`);
export const HANDS = ['ring', 'bracelet', 'bracelets', 'ankle bracelet', 'watch'].map((s) => F + `jewelery/${s}.webp`);

// 페이스페인팅
export const EYES = range(4).map((n) => FA + `eyes/${n}.png`);
export const EYEBROWS = range(10).map((n) => FA + `eyebrows/${n}.png`);
export const EYELASHES = range(7).map((n) => FA + `eyelashes/${n}.png`);
export const MOUTHS = range(14).map((n) => FA + `mouth/${n}.png`);
export const BLUSH = range(21).map((n) => FA + `decor face/${n}.png`);

// 면사포/왕관 - 머리 위에 얹는 SVG 오버레이 (에셋에 마땅한 게 없어 직접 그림)
// viewBox 0 0 800 1200 좌표계. 머리 윗부분(대략 x 400, y 170) 기준.
export const HEADWEAR = [
  { key: 'none', label: '없음', svg: '' },
  {
    key: 'tiara',
    label: '티아라',
    svg: `<path d="M330 195 L348 150 L366 192 L400 138 L434 192 L452 150 L470 195 C400 168 ${''}330 195 330 195 Z" fill="#fff3a0" stroke="#e0b53a" stroke-width="3"/>
          <circle cx="400" cy="150" r="9" fill="#9bdcff" stroke="#e0b53a" stroke-width="2"/>
          <circle cx="360" cy="172" r="6" fill="#ffd1e6"/>
          <circle cx="440" cy="172" r="6" fill="#ffd1e6"/>`,
  },
  {
    key: 'crown',
    label: '왕관',
    svg: `<path d="M322 200 L322 150 L356 184 L400 132 L444 184 L478 150 L478 200 Z" fill="#ffe08a" stroke="#d9a514" stroke-width="3"/>
          <rect x="322" y="198" width="156" height="16" rx="4" fill="#ffd45e" stroke="#d9a514" stroke-width="3"/>
          <circle cx="322" cy="150" r="7" fill="#ff8fb0"/><circle cx="400" cy="132" r="8" fill="#ff5d8f"/><circle cx="478" cy="150" r="7" fill="#ff8fb0"/>`,
  },
  {
    key: 'veil',
    label: '면사포',
    svg: `<path d="M300 200 Q400 150 500 200 Q540 480 470 760 Q400 730 330 760 Q260 480 300 200 Z" fill="#ffffff" opacity="0.35"/>
          <path d="M300 200 Q400 150 500 200" fill="none" stroke="#ffffff" stroke-width="6" opacity="0.8"/>
          <path d="M330 195 L348 158 L366 192 L400 150 L434 192 L452 158 L470 195 C400 172 330 195 330 195 Z" fill="#fff3a0" stroke="#e0b53a" stroke-width="3"/>
          <circle cx="400" cy="160" r="8" fill="#9bdcff"/>`,
  },
];
