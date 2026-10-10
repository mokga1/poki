// 이야기와 이벤트. hook: 'monthStart' | 'monthEnd' | 'bossWin'
// random: true 인 이벤트는 monthEnd 에 25% 확률로 그중 하나만 일어난다.
// run(s, api, data): api = { say(scenes)→선택 번호, add(delta), give(itemId), gold(n), shop(), eff() }
import { dateInfo } from '../rules.js';

// 캐릭터마다 다른 말투
const VOICE = {
  ruby: { yes: '좋아! 마왕 따위 내가 혼내줄게! 루루, 잘 부탁해!', wow: '에엣? 별이 고른 아이가… 나라고?! 멋지다!' },
  sapphire: { yes: '책에서만 보던 모험이에요… 열심히 해볼게요. 잘 부탁해요, 루루.', wow: '별이 저를…? 이건 분명 운명이에요.' },
  rose: { yes: '모두가 웃는 왕국을 위해서라면! 루루, 같이 힘내요♡', wow: '어머나, 제가요? 두근두근해요!' },
  emerald: { yes: '모험이다! 신난다! 루루, 빨리 가자!', wow: '우와아! 별이 날 골랐다고? 최고다!' },
};
const v = (s, k) => VOICE[s.charId][k];

export const EVENTS = [
  // ───────── 프롤로그 ─────────
  {
    id: 'prologue', hook: 'monthStart', once: true, when: (s) => s.month === 1,
    run: async (s, api) => {
      await api.say([
        { who: null, pic: '🏰', text: '옛날 옛적, 꽃과 요정이 함께 사는 **꽃잎 왕국**이 있었어요.' },
        { who: null, pic: '👑', text: '왕국을 지키는 건 네 개의 별 보석이 박힌 **별빛 왕관**. 왕관이 빛나는 동안 왕국엔 언제나 꽃이 피었지요.' },
        { who: 'grr', text: '흥! 아무도 나랑 안 놀아주는 왕국 따위… 보석을 몽땅 숨겨버릴 테다! 크하하… 하… 흥!' },
        { who: null, pic: '☁️', text: '어느 봄밤, 심술 마왕 **그르릉**이 별 보석 네 개를 훔쳐 왕국 곳곳에 숨겨버렸어요. 왕관은 빛을 잃고, 하늘엔 회색 구름이 끼기 시작했어요.' },
        { who: 'lulu', text: '똑똑! 안녕? 나는 별똥별을 타고 온 요정 **루루**야! 별이 고른 아이를 찾아왔어!' },
        { who: 'princess', mood: 'joy', text: v(s, 'wow') },
        { who: 'lulu', text: '응! {name}, 3년 뒤 **별빛 축제** 날까지 별 보석 4개를 모두 되찾아서 왕관을 되살려 줘!' },
        { who: 'lulu', text: '그러려면 먼저 튼튼하고 멋진 공주가 되어야 해. 공부도 하고, 일도 하고, 가끔은 푹 쉬고! 준비가 되면 **무사수행**을 떠나는 거야!' },
        { who: 'princess', mood: 'joy', text: v(s, 'yes') },
        { who: 'lulu', pic: '🌸', text: '약속의 선물이야! 들꽃으로 엮은 **꽃 화관**! 매달 무엇을 할지는 오른쪽 버튼으로 정하면 돼. 첫 보석은 **반짝반짝 숲**에 있대!' },
      ]);
      api.give('flower');
    },
  },

  // ───────── 생일 ─────────
  {
    id: 'birthday13', hook: 'monthStart', once: true, when: (s) => s.month === 13,
    run: async (s, api) => {
      await api.say([
        { who: 'lulu', pic: '🎂', text: '{name}, 생일 축하해! 벌써 **13살**이네! 케이크에 촛불 열세 개!' },
        { who: 'princess', mood: 'joy', text: '와아, 딸기 케이크다! 고마워, 루루!' },
        { who: 'lulu', pic: '💖', text: '그리고 이건 선물! 반짝반짝 **하트 목걸이**야. 모험할 때 힘이 되어줄 거야!' },
      ]);
      api.give('necklace');
    },
  },
  {
    id: 'birthday14', hook: 'monthStart', once: true, when: (s) => s.month === 25,
    run: async (s, api) => {
      await api.say([
        { who: 'lulu', pic: '🎂', text: '짜잔! **14살** 생일 축하해, {name}! 이번엔 루루가 직접 구운 케이크야. 조금 탔지만…' },
        { who: 'princess', mood: 'joy', text: '헤헤, 그래도 세상에서 제일 맛있어!' },
        { who: 'lulu', pic: '🧚', text: '선물은 루루랑 똑같은 **요정 날개**! 이제 우리 둘이 짝꿍이야!' },
      ]);
      api.give('wings');
    },
  },

  // ───────── 이야기 이벤트 ─────────
  {
    id: 'grrLetter', hook: 'monthStart', once: true, when: (s) => s.month === 18,
    run: async (s, api) => {
      await api.say([
        { who: null, pic: '💌', text: '어디선가 보라색 편지 한 통이 팔랑팔랑 날아왔어요.' },
        { who: 'grr', text: '흥! 보석은 절대 못 찾을걸! …그런데 너, 요즘 뭐 하고 노니? 궁금한 건 아니고! 흥!' },
        { who: 'lulu', text: '어머, 그르릉이 편지를 다 보내네? 후후, 사실은 심심한가 봐.' },
      ]);
    },
  },
  {
    id: 'towerOpen', hook: 'monthStart', once: true, when: (s) => s.gems.length >= 3 && !s.gems.includes('tower'),
    run: async (s, api) => {
      await api.say([
        { who: 'lulu', text: '{name}, 창밖을 봐! 하늘에… 하늘에 **구름 계단**이 생겼어!' },
        { who: null, pic: '🌈', text: '세 개의 별 보석이 빛을 모으자, 구름 위로 이어지는 반짝이는 계단이 나타났어요.' },
        { who: 'lulu', text: '저 끝에 **마왕의 탑**이 있어. 마지막 분홍 별은 거기 있을 거야. 준비가 되면 가보자!' },
      ]);
    },
  },
  {
    id: 'festivalSoon', hook: 'monthStart', once: true, when: (s) => s.month === 30,
    run: async (s, api) => {
      const left = 4 - s.gems.length;
      await api.say([
        { who: 'lulu', pic: '🎆', text: '{name}, 별빛 축제까지 이제 **6달** 남았어!' },
        left > 0
          ? { who: 'lulu', text: `찾아야 할 보석이 아직 **${left}개** 남았어. 조금만 더 힘내자!` }
          : { who: 'lulu', text: '보석은 벌써 다 찾았지! 남은 시간엔 하고 싶은 걸 마음껏 해봐. 어떤 어른이 될지 정말 궁금해!' },
      ]);
    },
  },

  // ───────── 가을 수확제 (매년 10월) ─────────
  {
    id: 'harvest', hook: 'monthEnd', when: (s) => dateInfo(s.month).mon === 10 && !s.flags[`harvest${s.month}`],
    run: async (s, api) => {
      s.flags[`harvest${s.month}`] = true;
      const pick = await api.say([
        { who: 'lulu', pic: '🎃', text: '가을 **수확제**가 열렸어요! 올해는 어떤 대회에 나가볼까요?', choices: ['⚔️ 무술대회', '🍰 요리대회', '💃 무도회', '🔮 마법대회', '구경만 할래'] },
      ]);
      if (pick === 4 || pick === null) {
        await api.say([{ who: 'princess', mood: 'joy', text: '솜사탕 먹으면서 구경하는 것도 최고야!' }]);
        api.add({ fat: -10 });
        return;
      }
      const C = [
        { name: '무술대회', a: 'str', b: 'vit', rival: 'toto', line: '얍! 내 주먹 맛을 보여주지!' },
        { name: '요리대회', a: 'vit', b: 'cha', rival: 'mimi', line: '미미표 무지개 케이크는 아무도 못 이겨~!' },
        { name: '무도회', a: 'cha', b: 'gra', rival: 'bella', line: '오호호, 무도회의 주인공은 나 벨라랍니다.' },
        { name: '마법대회', a: 'mgc', b: 'int', rival: 'luna', line: '…별빛 마법이라면 루나도 자신 있어.' },
      ][pick];
      const e = api.eff();
      const year = dateInfo(s.month).year;
      const score = e[C.a] + e[C.b] + Math.floor(Math.random() * 21);
      const rival = [60, 90, 120][year - 1] + Math.floor(Math.random() * 11);
      await api.say([
        { who: C.rival, text: C.line },
        { who: 'princess', text: '나도 질 수 없어! 연습한 대로만 하자…!' },
        { who: null, pic: '🥁', text: `두구두구두구… ${C.name} 결과 발표! **{name}: ${score}점**, 라이벌: ${rival}점!` },
      ]);
      if (score >= rival) {
        await api.say([
          { who: null, pic: '🏆', text: `우승이에요! {name}의 이름이 ${C.name} 트로피에 새겨졌어요!` },
          { who: C.rival, mood: 'hurt', text: '으으… 내년엔 꼭 이길 거야!' },
          { who: 'princess', mood: 'joy', text: '야호! 루루, 봤어? 봤어?' },
        ]);
        api.gold(100 * year);
        s.trophies = (s.trophies || 0) + 1;
      } else {
        await api.say([
          { who: null, pic: '🥈', text: '아쉽게도 2등! 그래도 정말 멋졌어요.' },
          { who: 'lulu', text: '괜찮아, 괜찮아! 위로 선물로 **마나 사탕**이야. 내년엔 꼭 이기자!' },
        ]);
        api.give('ether');
      }
    },
  },

  // ───────── 보스를 이긴 뒤 ─────────
  {
    id: 'win-mushroom', hook: 'bossWin', when: (s, d) => d.enemyId === 'mushroom' && d.info.gem,
    run: async (s, api) => {
      await api.say([
        { who: 'mushroom', text: '으으… 머리가 맑아졌다뭉… 보석 때문에 괜히 심술이 났던 거다뭉. 미안하다뭉!' },
        { who: 'princess', mood: 'joy', text: '괜찮아! 이제 숲을 잘 지켜줘!' },
        { who: 'lulu', pic: '💚', text: '**초록 별(용기)**을 되찾았어! 앞으로 세 개! 다음은 **수정 동굴**이야!' },
      ]);
    },
  },
  {
    id: 'win-golem', hook: 'bossWin', when: (s, d) => d.enemyId === 'golem' && d.info.gem,
    run: async (s, api) => {
      const ans = await api.say([
        { who: 'golem', text: '또각! 졌다 또각… 하지만! 내 수수께끼를 맞혀야 보석을 순순히 주지 또각!' },
        { who: 'golem', text: '세상에서 **가장 빠른 닭**은 무엇일까 또각?', choices: ['후다닥', '꼬꼬닭', '번개닭'] },
      ]);
      if (ans === 0) {
        await api.say([
          { who: 'golem', text: '정답이다 또각!! 후다닥! 너 정말 똑똑하구나 또각!' },
          { who: 'lulu', pic: '💙', text: '**파란 별(지혜)** 획득! 머리도 말랑말랑해졌대! (지능 +3)' },
        ]);
        api.add({ int: 3 });
      } else {
        await api.say([
          { who: 'golem', text: '땡! 정답은 **후다닥**이다 또각! 크크크, 또각또각… 웃겨서 보석을 줄 수밖에 없다 또각!' },
          { who: 'lulu', pic: '💙', text: '헤헤, 어쨌든 **파란 별(지혜)** 획득! 다음은 **얼음 성**이야!' },
        ]);
      }
    },
  },
  {
    id: 'win-frosty', hook: 'bossWin', when: (s, d) => d.enemyId === 'frosty' && d.info.gem,
    run: async (s, api) => {
      await api.say([
        { who: 'frosty', text: '…아무도 이 성에 오지 않았어. 그래서 전부 얼려버렸지. 외로웠거든.' },
        { who: 'princess', text: '그럼 이제 내가 친구 해줄게! 다음엔 같이 눈사람 만들자!' },
        { who: 'frosty', text: '정말…? (차가운 성의 얼음이 사르르 녹기 시작했어요) 고마워. 이 하얀 별과… 내 **별빛 드레스**를 줄게.' },
        { who: 'lulu', pic: '🤍', text: '**하얀 별(상냥함)**까지 세 개! 하늘에서 뭔가 반짝이기 시작했어…!' },
      ]);
    },
  },
  {
    id: 'win-grr', hook: 'bossWin', when: (s, d) => d.enemyId === 'grr' && d.info.gem,
    run: async (s, api) => {
      const ans = await api.say([
        { who: 'grr', text: '끄응… 졌다… 흐, 흐엉…' },
        { who: 'grr', text: '사실은… 백 년 동안 아무도… 나랑 안 놀아줘서… 그래서 심술이 났던 거야…' },
        { who: 'lulu', text: '{name}, 어떻게 할래?', choices: ['🤝 같이 놀자!', '😤 혼내준다'] },
      ]);
      if (ans === 0) {
        s.friendDemon = true;
        await api.say([
          { who: 'princess', mood: 'joy', text: '그럼 이제부터 나랑 놀자! 숨바꼭질도 하고, 소풍도 가고!' },
          { who: 'grr', text: '저, 정말…? 히… 히히. 그럼 이 **분홍 별** 줄게! 치, 친구니까!' },
          { who: 'lulu', pic: '💗', text: '**분홍 별(사랑)**! 드디어 보석 네 개를 모두 찾았어! 별빛 축제 날, 왕관이 다시 빛날 거야!' },
        ]);
      } else {
        await api.say([
          { who: 'princess', text: '보석을 훔치는 건 나쁜 거야! 다시는 그러면 안 돼!' },
          { who: 'grr', text: '흐엉! 보석 줄게! 다신 안 그럴게에~! (그르릉은 엉엉 울며 구름 너머로 날아갔어요)' },
          { who: 'lulu', pic: '💗', text: '**분홍 별(사랑)**까지 네 개 모두 찾았어! …그르릉, 조금 불쌍하기도 하다.' },
        ]);
      }
    },
  },

  // ───────── 가끔 찾아오는 손님들 (monthEnd, 25%) ─────────
  {
    id: 'nyang', hook: 'monthEnd', random: true, when: (s) => s.month >= 4,
    run: async (s, api) => {
      const ans = await api.say([
        { who: 'nyang', text: '냥냥~ 떠돌이 상인 **냥냥이**다냥! 오늘만 특별한 물건을 판다냥! 구경하고 갈 거냥?', choices: ['구경할래!', '다음에 올게'] },
      ]);
      if (ans === 0) await api.shop();
      else await api.say([{ who: 'nyang', text: '흥, 다음엔 꼭 사라냥~!' }]);
    },
  },
  {
    id: 'kong', hook: 'monthEnd', random: true, when: (s) => !s.flags.kong,
    run: async (s, api) => {
      const ans = await api.say([
        { who: 'kong', pic: '🌧️', text: '낑낑… (작은 강아지가 비를 맞으며 떨고 있어요. 목걸이에 **콩이**라고 쓰여 있어요.)', choices: ['집을 찾아준다', '간식을 나눠준다'] },
      ]);
      s.flags.kong = true;
      if (ans === 0) {
        await api.say([{ who: 'kong', text: '멍! 멍멍! (콩이는 꼬리를 흔들며 주인 품으로 돌아갔어요.)' }, { who: 'lulu', text: '{name}, 정말 착하다! (매력 +3)' }]);
        api.add({ cha: 3 });
      } else {
        s.flags.kongFriend = true;
        await api.say([{ who: 'kong', text: '왈! (콩이가 {name}의 볼을 핥았어요. 앞으로 가끔 놀러 올 것 같아요!)' }]);
        api.add({ cha: 1, fat: -5 });
      }
    },
  },
  {
    id: 'kongVisit', hook: 'monthEnd', random: true, when: (s) => s.flags.kongFriend,
    run: async (s, api) => {
      await api.say([{ who: 'kong', text: '왈왈! (콩이가 놀러 왔어요! 같이 들판을 뛰어다녔어요.)' }, { who: 'princess', mood: 'joy', text: '콩이야, 기다려~! 하하하!' }]);
      api.add({ vit: 2, fat: -10 });
    },
  },
  {
    id: 'leo', hook: 'monthEnd', random: true, when: (s) => s.month >= 3,
    run: async (s, api) => {
      const ans = await api.say([
        { who: 'leo', text: '안녕하세요, 이웃 나라의 **레오**예요. 저희 성 다과회에 와주시겠어요? 장미 쿠키가 아주 맛있답니다.', choices: ['갈래요!', '이번엔 사양할게요'] },
      ]);
      if (ans === 0) {
        await api.say([{ who: null, pic: '🍪', text: '반짝이는 찻잔, 향긋한 홍차. 우아하게 다과회를 즐겼어요. (기품 +4, 피로 +5)' }, { who: 'leo', text: '오늘 정말 즐거웠어요. 또 초대할게요!' }]);
        api.add({ gra: 4, fat: 5 });
      } else {
        await api.say([{ who: 'leo', text: '아쉽네요. 다음엔 꼭 와주세요!' }]);
      }
    },
  },
  {
    id: 'momo', hook: 'monthEnd', random: true, when: () => true,
    run: async (s, api) => {
      await api.say([{ who: 'momo', pic: '🍲', text: '숲속 마녀 할머니 **모모**란다. 오호호, 마법 수프 한 그릇 먹어보렴~' }]);
      if (Math.random() < 0.7) {
        await api.say([{ who: 'princess', mood: 'joy', text: '음~ 달콤해! 몸이 반짝반짝 빛나는 것 같아! (마력 +4)' }]);
        api.add({ mgc: 4 });
      } else {
        await api.say([{ who: 'princess', mood: 'hurt', text: '으엑, 브로콜리 맛…! 그래도 힘이 나는 것 같기도…? (마력 +2, 피로 +10)' }]);
        api.add({ mgc: 2, fat: 10 });
      }
    },
  },
  {
    id: 'thief', hook: 'monthEnd', random: true, when: (s) => s.gold >= 20,
    run: async (s, api) => {
      const ans = await api.say([{ who: null, pic: '🐿️', text: '앗! 다람쥐가 동전 주머니를 물고 달아나요!', choices: ['쫓아간다!', '포기한다…'] }]);
      if (ans === 0 && api.eff().str >= 40) {
        await api.say([{ who: 'princess', mood: 'joy', text: '잡았다! 주머니도 찾고, 다람쥐가 미안하다며 도토리 동전까지 줬어! (+30 G)' }]);
        api.gold(30);
      } else if (ans === 0) {
        await api.say([{ who: 'princess', mood: 'hurt', text: '헉헉… 너무 빨라… 놓쳐버렸어… (-20 G) 힘을 더 길러야겠어!' }]);
        api.gold(-20);
      } else {
        await api.say([{ who: 'lulu', text: '다람쥐도 배가 고팠나 봐… (-10 G)' }]);
        api.gold(-10);
      }
    },
  },
  {
    id: 'rainy', hook: 'monthEnd', random: true, when: () => true,
    run: async (s, api) => {
      await api.say([{ who: null, pic: '☔', text: '주룩주룩 비 오는 날. 창가에 앉아 두꺼운 동화책을 끝까지 읽었어요. (지능 +3)' }]);
      api.add({ int: 3 });
    },
  },
  {
    id: 'wish', hook: 'monthEnd', random: true, when: () => true,
    run: async (s, api) => {
      const ans = await api.say([{ who: 'lulu', pic: '🌠', text: '{name}, 별똥별이다! 얼른 소원을 빌어!', choices: ['튼튼해지게 해주세요', '똑똑해지게 해주세요', '예뻐지게 해주세요'] }]);
      const k = ['vit', 'int', 'cha'][ans ?? 0];
      api.add({ [k]: 3 });
      await api.say([{ who: 'lulu', text: '별님이 들어주신 것 같아! 반짝!' }]);
    },
  },
];
