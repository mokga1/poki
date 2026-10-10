// 무사수행 지역. need(state) 가 true 면 갈 수 있다.
export const REGIONS = [
  { id: 'forest', name: '반짝반짝 숲', icon: '🌳', enemies: ['slime', 'bunny', 'squirrel'], boss: 'mushroom', gem: 'forest', steps: 6, tier: 1,
    need: () => true, lock: '' },
  { id: 'cave', name: '수정 동굴', icon: '💎', enemies: ['bat', 'turtle', 'crab'], boss: 'golem', gem: 'cave', steps: 6, tier: 2,
    need: (s) => s.gems.includes('forest'), lock: '숲에서 초록 별을 찾으면 열려요' },
  { id: 'ice', name: '얼음 성', icon: '❄️', enemies: ['snowman', 'icefairy', 'penguin'], boss: 'frosty', gem: 'ice', steps: 6, tier: 3,
    need: (s) => s.gems.includes('cave'), lock: '동굴에서 파란 별을 찾으면 열려요' },
  { id: 'tower', name: '마왕의 탑', icon: '🏰', enemies: ['ghost', 'sheep', 'soldier'], boss: 'grr', gem: 'tower', steps: 6, tier: 4,
    need: (s) => s.gems.length >= 3, lock: '별 보석 3개를 모으면 구름 계단이 생겨요' },
];

export const GEM_INFO = {
  forest: { name: '초록 별', color: '#5fd492', meaning: '용기' },
  cave: { name: '파란 별', color: '#6fb6ff', meaning: '지혜' },
  ice: { name: '하얀 별', color: '#d8ecff', meaning: '상냥함' },
  tower: { name: '분홍 별', color: '#ff8fc4', meaning: '사랑' },
};
