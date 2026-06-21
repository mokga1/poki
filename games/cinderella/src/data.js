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

// 옷장 - 머리
// hair (back)/Na = 앞에서 볼 때 머리(앞면), Nb = 뒤에서 볼 때(뒤통수). 앞면(a)만 사용.
export const HAIR_BACK = range(10).map((n) => F + `hair (back)/${n}a.webp`);
// 앞머리(프린지) - 따로 선택
export const BANGS = range(10).map((n) => F + `hair (bangs)/${n}.webp`);

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
// 눈동자 (눈매 아래 레이어). 색: a=초록, b=파랑, c=갈색.
// 모양: 1·2=고양이눈(세로동공), 3·4=동그란눈, 5=별 반짝이.
// 귀여운 동그란/반짝이 눈을 앞에, 고양이눈은 뒤로. 기본 = 5b(파랑 반짝이).
export const PUPILS = [
  '5b', '5a', '5c', // 별 반짝이 (파/초/갈)
  '4b', '4a', '4c', // 동그란 눈
  '3b', '3a', '3c',
  '1b', '1a', '1c', // 고양이 눈
  '2b', '2a', '2c',
].map((s) => FA + `pupils/${s}.png`);
export const EYEBROWS = range(10).map((n) => FA + `eyebrows/${n}.png`);
export const EYELASHES = range(7).map((n) => FA + `eyelashes/${n}.png`);
export const MOUTHS = range(14).map((n) => FA + `mouth/${n}.png`);
export const BLUSH = range(21).map((n) => FA + `decor face/${n}.png`);

// 면사포/왕관 - 머리 위에 얹는 SVG 오버레이 (에셋에 마땅한 게 없어 직접 그림)
// viewBox 0 0 800 1200 좌표계. 측정값: 머리 꼭대기 y≈195, 중심 x=400, 눈 y≈286.
// 티아라/왕관 밴드는 y≈210~232 (이마 윗머리)에 얹고 뾰족이는 y≈190까지 올린다.
export const HEADWEAR = [
  { key: 'none', label: '없음', svg: '' },
  {
    key: 'tiara',
    label: '티아라',
    svg: `<path d="M352 230 Q400 212 448 230 L442 217 L429 225 L417 204 L406 219 L400 192 L394 219 L383 204 L371 225 L358 217 Z" fill="#ffe9a0" stroke="#e0b53a" stroke-width="3" stroke-linejoin="round"/>
          <circle cx="400" cy="202" r="6" fill="#9bdcff" stroke="#e0b53a" stroke-width="2"/>
          <circle cx="383" cy="216" r="3.5" fill="#ff9ecb"/>
          <circle cx="417" cy="216" r="3.5" fill="#ff9ecb"/>`,
  },
  {
    key: 'crown',
    label: '왕관',
    svg: `<path d="M356 234 L356 214 L378 227 L400 197 L422 227 L444 214 L444 234 Z" fill="#ffe08a" stroke="#d9a514" stroke-width="3" stroke-linejoin="round"/>
          <rect x="356" y="231" width="88" height="11" rx="3" fill="#ffd45e" stroke="#d9a514" stroke-width="3"/>
          <circle cx="356" cy="214" r="5" fill="#ff8fb0"/><circle cx="400" cy="197" r="6" fill="#ff5d8f"/><circle cx="444" cy="214" r="5" fill="#ff8fb0"/>`,
  },
  {
    key: 'veil',
    label: '면사포',
    svg: `<path d="M362 224 Q300 460 320 790 Q362 772 376 790 Q374 470 398 248 Z" fill="#ffffff" opacity="0.26"/>
          <path d="M438 224 Q500 460 480 790 Q438 772 424 790 Q426 470 402 248 Z" fill="#ffffff" opacity="0.26"/>
          <path d="M360 228 Q400 212 440 228 Q440 240 400 237 Q360 240 360 228 Z" fill="#ffffff" opacity="0.5"/>
          <path d="M356 230 Q400 214 444 230 L438 219 L406 221 L400 198 L394 221 L362 219 Z" fill="#fff6c8" stroke="#e0b53a" stroke-width="2" stroke-linejoin="round"/>
          <circle cx="400" cy="206" r="5" fill="#9bdcff"/>`,
  },
];
