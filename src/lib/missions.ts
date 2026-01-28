// 연령별 추천 미션 풀 (3개 랜덤 선택용)
const YOUNG: string[] = [
  "가방 챙기기",
  "양치하기",
  "밥 골고루 먹기",
  "손 씻기",
  "방 정리하기",
  "말 잘 듣기",
  "TV 시간 지키기",
  "이불 개기",
  "세수하기",
  "머리 빗기",
  "옷 갈아입기",
  "신발 정리하기",
];

const OLDER: string[] = [
  ...YOUNG,
  "숙제하기",
  "친구와 사이좋게 지내기",
  "게임 시간 지키기",
  "책 읽기",
];

export function getRecommendedMissions(age: number): [string, string, string] {
  const pool = age >= 8 ? OLDER : YOUNG;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return [shuffled[0]!, shuffled[1]!, shuffled[2]!];
}
