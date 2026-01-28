import { supabase } from "./supabase";
import type { Child, ChildMission, Family, FamilySettings, Gender } from "./types";
import type { ProfileIconId } from "./types";
import { getRecommendedMissions } from "./missions";

const FAMILY_CODE_KEY = "chingchan_family_code";

export function getStoredFamilyCode(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(FAMILY_CODE_KEY);
}

export function setStoredFamilyCode(code: string) {
  localStorage.setItem(FAMILY_CODE_KEY, code);
}

export function clearStoredFamilyCode() {
  localStorage.removeItem(FAMILY_CODE_KEY);
}

function generateFamilyCode(): string {
  return String(Math.floor(100_000 + Math.random() * 900_000));
}

export async function createFamily(): Promise<{ familyCode: string; familyId: string }> {
  for (let i = 0; i < 10; i++) {
    const code = generateFamilyCode();
    const { data: fam, error: e1 } = await supabase
      .from("families")
      .insert({ family_code: code })
      .select("id")
      .single();
    if (e1) {
      if ((e1 as { code?: string })?.code === "23505") continue; // unique conflict
      throw e1;
    }
    const { error: e2 } = await supabase.from("family_settings").insert({
      family_id: fam!.id,
      app_title: "우리집 칭찬스티커",
      target_count: 10,
    });
    if (e2) {
      await supabase.from("families").delete().eq("id", fam!.id);
      throw e2;
    }
    setStoredFamilyCode(code);
    return { familyCode: code, familyId: fam!.id };
  }
  throw new Error("Family code 생성 실패");
}

export async function joinFamily(code: string): Promise<{ familyId: string }> {
  const trimmed = code.replace(/\s/g, "");
  const { data, error } = await supabase
    .from("families")
    .select("id")
    .eq("family_code", trimmed)
    .single();
  if (error || !data) throw new Error("가족을 찾을 수 없어요. 코드를 확인해 주세요.");
  setStoredFamilyCode(trimmed);
  return { familyId: data.id };
}

export async function fetchFamilyByCode(code: string): Promise<Family | null> {
  const { data } = await supabase.from("families").select("*").eq("family_code", code).single();
  return data;
}

export async function fetchFamilySettings(familyId: string): Promise<FamilySettings | null> {
  const { data } = await supabase.from("family_settings").select("*").eq("family_id", familyId).single();
  return data;
}

export async function fetchChildren(familyId: string): Promise<Child[]> {
  const { data } = await supabase.from("children").select("*").eq("family_id", familyId).order("sort_order");
  return data ?? [];
}

export async function fetchChildMissions(childId: string): Promise<ChildMission[]> {
  const { data } = await supabase.from("child_missions").select("*").eq("child_id", childId).order("slot_index");
  return data ?? [];
}

export async function updateFamilySettings(
  familyId: string,
  patch: { app_title?: string; target_count?: number }
) {
  const { error } = await supabase
    .from("family_settings")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("family_id", familyId);
  if (error) throw error;
}

export async function addChild(
  familyId: string,
  child: { name: string; age: number; gender: Gender; icon: ProfileIconId }
): Promise<Child> {
  const maxOrder = await supabase.from("children").select("sort_order").eq("family_id", familyId).order("sort_order", { ascending: false }).limit(1).single();
  const nextOrder = (maxOrder.data?.sort_order ?? -1) + 1;
  const { data: c, error: e1 } = await supabase
    .from("children")
    .insert({ family_id: familyId, ...child, sort_order: nextOrder })
    .select()
    .single();
  if (e1) throw e1;
  const [m1, m2, m3] = getRecommendedMissions(child.age);
  await supabase.from("child_missions").insert([
    { child_id: c!.id, mission_text: m1, slot_index: 0, is_custom: false },
    { child_id: c!.id, mission_text: m2, slot_index: 1, is_custom: false },
    { child_id: c!.id, mission_text: m3, slot_index: 2, is_custom: false },
    { child_id: c!.id, mission_text: "", slot_index: 3, is_custom: true },
  ]);
  return c!;
}

export async function updateChild(
  childId: string,
  patch: { name?: string; age?: number; gender?: Gender; icon?: ProfileIconId }
) {
  const { error } = await supabase.from("children").update(patch).eq("id", childId);
  if (error) throw error;
}

export async function deleteChild(childId: string) {
  const { error } = await supabase.from("children").delete().eq("id", childId);
  if (error) throw error;
}

export async function refreshChildMissions(childId: string, age: number) {
  const [m1, m2, m3] = getRecommendedMissions(age);
  for (let i = 0; i < 3; i++) {
    const text = [m1, m2, m3][i]!;
    await supabase
      .from("child_missions")
      .update({ mission_text: text, updated_at: new Date().toISOString() })
      .eq("child_id", childId)
      .eq("slot_index", i);
  }
}

export async function updateChildMission(childId: string, slotIndex: number, missionText: string) {
  const { error } = await supabase
    .from("child_missions")
    .update({ mission_text: missionText, updated_at: new Date().toISOString() })
    .eq("child_id", childId)
    .eq("slot_index", slotIndex);
  if (error) throw error;
}

export async function addStickerEvent(childId: string, missionText: string) {
  const { error } = await supabase.from("sticker_events").insert({ child_id: childId, mission_text: missionText });
  if (error) throw error;
}

export async function addChildReset(childId: string) {
  const { error } = await supabase.from("child_resets").insert({ child_id: childId });
  if (error) throw error;
}

export async function fetchLastResetAt(childId: string): Promise<string | null> {
  const { data } = await supabase
    .from("child_resets")
    .select("reset_at")
    .eq("child_id", childId)
    .order("reset_at", { ascending: false })
    .limit(1)
    .single();
  return data?.reset_at ?? null;
}

export async function fetchStickerEventsSince(childId: string, since: string | null): Promise<{ mission_text: string; created_at: string }[]> {
  let q = supabase.from("sticker_events").select("mission_text, created_at").eq("child_id", childId).order("created_at", { ascending: false }).limit(50);
  if (since) q = q.gt("created_at", since);
  const { data } = await q;
  return data ?? [];
}
