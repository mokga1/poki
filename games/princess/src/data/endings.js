// 엔딩. 위에서부터 먼저 조건이 맞는 것이 나온다. e = 장비 포함 능력치, s = 게임 상태
// text 의 {name} 은 공주 이름으로 바뀐다.
const gems4 = (s) => s.gems.length === 4;

export const ENDINGS = [
  {
    id: 'queen', title: '별빛 여왕', scene: 'throne', outfit: 'ballgown', hat: 'tiara',
    hint: '보석을 모두 찾고, 기품과 매력이 아주 높으면…',
    cond: (e, s) => gems4(s) && e.gra >= 70 && e.cha >= 70,
    text: '별빛 왕관이 {name}의 머리 위에서 환하게 빛났어요. 왕국 사람들은 입을 모아 외쳤지요. "우리의 별빛 여왕님!" {name}은 꽃잎 왕국 역사상 가장 다정하고 우아한 여왕이 되었답니다. 루루는 여왕님의 첫 번째 친구로 늘 곁에 있었대요.',
  },
  {
    id: 'peace', title: '마왕과 친구가 된 평화의 공주', scene: 'peace', outfit: 'stardress', hat: 'flower',
    hint: '심술쟁이 마왕과 친구가 된다면…',
    cond: (e, s) => gems4(s) && s.friendDemon && e.cha >= 60,
    text: '별빛 축제 날, 구름 위 탑에서 그르릉이 쭈뼛쭈뼛 내려왔어요. "나… 나도 축제 가도 돼?" {name}이 손을 내밀자 그르릉은 활짝 웃었지요. 그 뒤로 꽃잎 왕국에는 해마다 "그르릉과 함께 노는 날"이 생겼답니다. 이제 아무도 외롭지 않아요.',
  },
  {
    id: 'hero', title: '전설의 용사 공주', scene: 'hero', outfit: 'knightdress', hat: 'silver',
    hint: '보석을 모두 찾고, 힘이 아주 세다면…',
    cond: (e, s) => gems4(s) && e.str >= 70,
    text: '네 개의 별 보석을 모두 되찾은 {name}의 이야기는 노래가 되어 온 세상에 퍼졌어요. 아이들은 나무막대를 들고 "내가 {name}이다!" 하며 뛰어놀지요. 전설의 용사 공주는 오늘도 누군가를 도우러 힘차게 길을 떠납니다.',
  },
  {
    id: 'wizard', title: '대마법사', scene: 'magic', outfit: 'robe', hat: 'witch',
    hint: '마력과 지능을 높이 키우면…',
    cond: (e) => e.mgc >= 70 && e.int >= 60,
    text: '{name}이 지팡이를 한 번 휘두르면 겨울에도 꽃이 피고, 밤하늘에 별 그림이 그려졌어요. 마법 학교의 최연소 교장 선생님이 된 {name}은 "마법은 사람을 웃게 하려고 있는 거야"라고 가르친대요.',
  },
  {
    id: 'knight', title: '왕궁 기사단장', scene: 'hero', outfit: 'knightdress', hat: 'silver',
    hint: '힘과 체력을 높이 키우면…',
    cond: (e) => e.str >= 70 && e.vit >= 60,
    text: '반짝이는 은빛 갑옷을 입은 {name}이 기사단 맨 앞에 섰어요. "꽃잎 왕국은 우리가 지킨다!" 씩씩한 목소리에 기사들이 힘차게 대답했지요. 왕국 최초의 소녀 기사단장 탄생이에요!',
  },
  {
    id: 'scholar', title: '왕국 최고의 학자', scene: 'library', outfit: 'robe', hat: null,
    hint: '지능을 아주 높이 키우면…',
    cond: (e) => e.int >= 75,
    text: '왕궁 도서관의 책을 모두 읽어버린 {name}은 직접 책을 쓰기 시작했어요. 첫 책 제목은 『별빛 왕관의 비밀』. 왕국의 모든 아이들이 이 책을 읽으며 꿈을 키운답니다.',
  },
  {
    id: 'dancer', title: '무도회의 별', scene: 'ballroom', outfit: 'ballgown', hat: 'flower',
    hint: '매력을 아주 높이 키우면…',
    cond: (e) => e.cha >= 75,
    text: '{name}이 무대에서 빙글 돌 때마다 드레스에서 꽃잎이 흩날렸어요. 이웃 나라에서도 {name}의 춤을 보러 손님이 몰려왔지요. 무도회의 별 {name}은 오늘도 박수 속에서 반짝여요.',
  },
  {
    id: 'diplomat', title: '우아한 외교관', scene: 'throne', outfit: 'ballgown', hat: 'tiara',
    hint: '기품을 아주 높이 키우면…',
    cond: (e) => e.gra >= 75,
    text: '다투던 두 나라의 왕들도 {name} 앞에서는 저절로 고개를 끄덕였어요. "차 한 잔 하면서 이야기해요." {name}의 우아한 말 한마디에 세상이 조금씩 평화로워졌답니다.',
  },
  {
    id: 'adventurer', title: '세계를 누비는 모험가', scene: 'field', outfit: 'apron', hat: null,
    hint: '모험을 아주 많이 다니면…',
    cond: (e, s) => s.level >= 15 || s.wins >= 40,
    text: '숲, 동굴, 얼음 성을 모두 누빈 {name}에게 꽃잎 왕국은 너무 작았어요. 커다란 배낭을 메고 루루와 함께 바다 건너 새로운 모험을 떠났지요. 다음엔 어떤 친구를 만날까요?',
  },
  {
    id: 'bakery', title: '빵집 사장님', scene: 'bakery', outfit: 'apron', hat: null,
    hint: '빵집에서 일을 많이 하면…',
    cond: (e, s) => (s.counts.bakery || 0) >= 8,
    text: '"{name}네 빵집"의 별 모양 크루아상은 왕국 최고의 인기 메뉴예요. 아침마다 줄이 길게 늘어서고, 그르릉도 몰래 와서 빵을 사간다는 소문이 있어요!',
  },
  {
    id: 'florist', title: '꽃집 주인', scene: 'flower', outfit: 'apron', hat: 'flower',
    hint: '꽃집에서 일을 많이 하면…',
    cond: (e, s) => (s.counts.florist || 0) >= 8,
    text: '{name}의 꽃집에는 세상에서 가장 예쁜 꽃다발이 있어요. 기쁜 날에도, 슬픈 날에도 사람들은 {name}을 찾아오지요. 꽃향기 가득한 가게에서 {name}은 매일 행복하게 웃어요.',
  },
  {
    id: 'normal', title: '행복한 보통 소녀', scene: 'field', outfit: 'apron', hat: 'flower',
    hint: '어떻게 키워도 볼 수 있어요',
    cond: () => true,
    text: '특별한 왕관은 없어도, {name}에게는 소중한 친구들과 따뜻한 집이 있어요. 별빛 축제 밤, 루루와 함께 별똥별을 보며 {name}은 생각했어요. "앞으로 뭐든 될 수 있어. 내일이 기대돼!"',
  },
];
