export type Gender = "male" | "female" | "other";

export const PROFILE_ICONS = [
  { id: "dino", emoji: "🦕", label: "공룡" },
  { id: "robot", emoji: "🤖", label: "로봇" },
  { id: "fairy", emoji: "🧚", label: "요정" },
  { id: "dog", emoji: "🐶", label: "강아지" },
  { id: "cat", emoji: "🐱", label: "고양이" },
  { id: "bear", emoji: "🐻", label: "곰" },
  { id: "rabbit", emoji: "🐰", label: "토끼" },
  { id: "fox", emoji: "🦊", label: "여우" },
  { id: "unicorn", emoji: "🦄", label: "유니콘" },
  { id: "frog", emoji: "🐸", label: "개구리" },
] as const;

export type ProfileIconId = (typeof PROFILE_ICONS)[number]["id"];

export interface Family {
  id: string;
  family_code: string;
  created_at: string;
}

export interface FamilySettings {
  family_id: string;
  app_title: string;
  target_count: number;
  updated_at: string;
}

export interface Child {
  id: string;
  family_id: string;
  name: string;
  age: number;
  gender: Gender;
  icon: ProfileIconId;
  sort_order: number;
  created_at: string;
}

export interface ChildMission {
  id: string;
  child_id: string;
  mission_text: string;
  slot_index: number;
  is_custom: boolean;
  updated_at: string;
}

export interface StickerEvent {
  id: string;
  child_id: string;
  mission_text: string;
  created_at: string;
}

export interface ChildReset {
  id: string;
  child_id: string;
  reset_at: string;
}
