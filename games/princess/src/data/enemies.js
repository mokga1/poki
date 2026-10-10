// 적 능력치. 수치는 tests/princess/balance.test.js 로 확인하며 조정한다.
export const ENEMIES = {
  slime:    { id: 'slime', name: '말랑 슬라임', skill: '말랑 박치기', hp: 16, atk: 7, def: 1, exp: 4, gold: 8 },
  bunny:    { id: 'bunny', name: '꽃 토끼', skill: '깡총 발차기', hp: 20, atk: 9, def: 2, exp: 5, gold: 10 },
  squirrel: { id: 'squirrel', name: '도토리 다람쥐', skill: '도토리 던지기', hp: 22, atk: 10, def: 3, exp: 6, gold: 12 },
  mushroom: { id: 'mushroom', name: '대왕 버섯 뭉게', skill: '포자 뿜뿜', hp: 80, atk: 14, def: 5, exp: 30, gold: 120, boss: true, gem: 'forest' },

  bat:    { id: 'bat', name: '박쥐 박박이', skill: '초음파 찍찍', hp: 36, atk: 16, def: 5, exp: 10, gold: 18 },
  turtle: { id: 'turtle', name: '돌멩이 거북', skill: '단단 박치기', hp: 48, atk: 14, def: 10, exp: 12, gold: 20 },
  crab:   { id: 'crab', name: '수정 게', skill: '집게 꼬집기', hp: 42, atk: 18, def: 7, exp: 12, gold: 22 },
  golem:  { id: 'golem', name: '수정 골렘 또각이', skill: '수정 주먹', hp: 150, atk: 24, def: 12, exp: 60, gold: 200, boss: true, gem: 'cave' },

  snowman:  { id: 'snowman', name: '눈사람 뭉치', skill: '눈덩이 던지기', hp: 60, atk: 22, def: 10, exp: 16, gold: 26 },
  icefairy: { id: 'icefairy', name: '얼음 요정 링', skill: '고드름 화살', hp: 55, atk: 26, def: 8, exp: 17, gold: 28 },
  penguin:  { id: 'penguin', name: '펭귄 기사', skill: '펭귄 찌르기', hp: 75, atk: 24, def: 14, exp: 18, gold: 30 },
  frosty:   { id: 'frosty', name: '눈의 여왕 프로스티', skill: '얼음 폭풍', hp: 220, atk: 32, def: 16, exp: 90, gold: 300, boss: true, gem: 'ice', drop: 'stardress' },

  ghost:   { id: 'ghost', name: '꼬마 유령 부우', skill: '깜짝 놀래키기', hp: 90, atk: 30, def: 14, exp: 22, gold: 34 },
  sheep:   { id: 'sheep', name: '구름 양', skill: '구름 박치기', hp: 100, atk: 28, def: 18, exp: 22, gold: 34 },
  soldier: { id: 'soldier', name: '장난감 병정', skill: '태엽 돌격', hp: 110, atk: 34, def: 20, exp: 25, gold: 40 },
  grr:     { id: 'grr', name: '심술 마왕 그르릉', skill: '심술 번개', hp: 340, atk: 42, def: 24, exp: 150, gold: 500, boss: true, gem: 'tower', drop: 'heartsword' },
};
