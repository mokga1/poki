// 장비와 소모품. bonus 키: atk matk def maxHp maxMp flee goldRate + 능력치(vit str int mgc cha gra)
// shop: 'normal' = 마을 상점, 'special' = 냥냥이 특별 상점, null = 상점에 없음(보스 보상·기본 옷)
export const ITEMS = {
  // 무기
  wood:       { id: 'wood', slot: 'weapon', name: '나무검', price: 30, shop: 'normal', bonus: { atk: 3 }, desc: '처음 모험에 딱 좋은 가벼운 나무검' },
  knight:     { id: 'knight', slot: 'weapon', name: '기사의 검', price: 150, shop: 'normal', bonus: { atk: 8 }, desc: '반짝이는 진짜 기사의 검' },
  starwand:   { id: 'starwand', slot: 'weapon', name: '별빛 지팡이', price: 160, shop: 'normal', bonus: { matk: 8, mgc: 2 }, desc: '끝에 별이 달린 마법 지팡이' },
  rainbow:    { id: 'rainbow', slot: 'weapon', name: '무지개 활', price: 220, shop: 'special', bonus: { atk: 6, matk: 4 }, desc: '쏘면 무지개 꼬리가 생기는 활' },
  heartsword: { id: 'heartsword', slot: 'weapon', name: '하트 성검', price: 0, shop: null, bonus: { atk: 14, matk: 6 }, desc: '마음이 따뜻한 사람만 들 수 있는 전설의 검' },
  // 옷
  apron:       { id: 'apron', slot: 'outfit', name: '앞치마 드레스', price: 0, shop: null, bonus: { def: 1 }, desc: '늘 입던 편안한 드레스' },
  knightdress: { id: 'knightdress', slot: 'outfit', name: '기사 드레스', price: 160, shop: 'normal', bonus: { def: 6 }, desc: '은빛 갑옷이 달린 튼튼한 드레스' },
  robe:        { id: 'robe', slot: 'outfit', name: '마법사 로브', price: 150, shop: 'normal', bonus: { def: 3, mgc: 4 }, desc: '별 무늬가 수놓인 보랏빛 로브' },
  ballgown:    { id: 'ballgown', slot: 'outfit', name: '무도회 드레스', price: 260, shop: 'normal', bonus: { def: 2, cha: 10 }, desc: '세 겹 치마가 살랑이는 무도회 드레스' },
  stardress:   { id: 'stardress', slot: 'outfit', name: '별빛 드레스', price: 0, shop: null, bonus: { def: 10, cha: 5, gra: 5 }, desc: '눈의 여왕이 선물한 반짝반짝 드레스' },
  // 모자
  flower: { id: 'flower', slot: 'hat', name: '꽃 화관', price: 40, shop: 'normal', bonus: { cha: 3 }, desc: '들꽃으로 엮은 향기로운 화관' },
  witch:  { id: 'witch', slot: 'hat', name: '마법사 모자', price: 90, shop: 'normal', bonus: { mgc: 3 }, desc: '끝이 살짝 구부러진 마법사 모자' },
  silver: { id: 'silver', slot: 'hat', name: '은빛 머리장식', price: 100, shop: 'normal', bonus: { def: 3 }, desc: '날개 모양 은빛 머리장식' },
  tiara:  { id: 'tiara', slot: 'hat', name: '티아라', price: 200, shop: 'normal', bonus: { gra: 5 }, desc: '보석이 박힌 공주님 티아라' },
  // 액세서리
  necklace: { id: 'necklace', slot: 'acc', name: '하트 목걸이', price: 60, shop: 'normal', bonus: { maxHp: 10 }, desc: '하트 보석이 달린 목걸이' },
  cape:     { id: 'cape', slot: 'acc', name: '망토', price: 80, shop: 'normal', bonus: { def: 2 }, desc: '바람에 휘날리는 빨간 망토' },
  clover:   { id: 'clover', slot: 'acc', name: '행운의 클로버', price: 120, shop: 'normal', bonus: { goldRate: 0.2 }, desc: '돈을 20% 더 벌게 해주는 머리핀' },
  wings:    { id: 'wings', slot: 'acc', name: '요정 날개', price: 180, shop: 'special', bonus: { maxMp: 10, flee: 0.2 }, desc: '팔랑팔랑, 도망칠 때도 빨라요' },
  // 소모품
  potion:    { id: 'potion', slot: 'use', name: '물약', price: 20, shop: 'normal', heal: 30, desc: 'HP를 30 회복해요' },
  ether:     { id: 'ether', slot: 'use', name: '마나 사탕', price: 25, shop: 'normal', mana: 15, desc: 'MP를 15 회복해요' },
  bigpotion: { id: 'bigpotion', slot: 'use', name: '큰 물약', price: 60, shop: 'special', heal: 999, desc: 'HP를 전부 회복해요' },
};

export const SLOT_NAMES = { weapon: '무기', outfit: '옷', hat: '모자', acc: '액세서리', use: '물약' };
