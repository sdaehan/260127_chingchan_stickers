"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";
import * as api from "@/lib/family-api";
import type { Child, ChildMission, Family, FamilySettings, Gender } from "@/lib/types";
import type { ProfileIconId } from "@/lib/types";

type FamilyContextValue = {
  familyCode: string | null;
  familyId: string | null;
  family: Family | null;
  settings: FamilySettings | null;
  children: Child[];
  childrenMissions: Record<string, ChildMission[]>;
  isLoading: boolean;
  isOnboarded: boolean;
  createFamily: () => Promise<void>;
  joinFamily: (code: string) => Promise<void>;
  leaveFamily: () => void;
  refetch: () => Promise<void>;
  updateSettings: (patch: { app_title?: string; target_count?: number }) => Promise<void>;
  addChild: (child: { name: string; age: number; gender: Gender; icon: ProfileIconId }) => Promise<Child>;
  updateChild: (childId: string, patch: { name?: string; age?: number; gender?: Gender; icon?: ProfileIconId }) => Promise<void>;
  deleteChild: (childId: string) => Promise<void>;
  refreshMissions: (childId: string, age: number) => Promise<void>;
  updateMission: (childId: string, slotIndex: number, text: string) => Promise<void>;
  setChildrenMissions: (childId: string, missions: ChildMission[]) => void;
};

const FamilyContext = createContext<FamilyContextValue | null>(null);

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [familyCode, setFamilyCodeState] = useState<string | null>(null);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [settings, setSettings] = useState<FamilySettings | null>(null);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [childrenMissions, setChildrenMissionsState] = useState<Record<string, ChildMission[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const subRef = useRef<{ unsubscribe: () => void } | null>(null);

  const refetch = useCallback(async () => {
    if (!familyId) return;
    const [s, ch] = await Promise.all([api.fetchFamilySettings(familyId), api.fetchChildren(familyId)]);
    setSettings(s);
    setChildrenList(ch);
    const missions: Record<string, ChildMission[]> = {};
    await Promise.all(
      ch.map(async (c) => {
        missions[c.id] = await api.fetchChildMissions(c.id);
      })
    );
    setChildrenMissionsState(missions);
  }, [familyId]);

  useEffect(() => {
    const code = api.getStoredFamilyCode();
    if (!code) {
      setIsLoading(false);
      setIsOnboarded(false);
      return;
    }
    setFamilyCodeState(code);
    (async () => {
      const fam = await api.fetchFamilyByCode(code);
      if (!fam) {
        api.clearStoredFamilyCode();
        setFamilyCodeState(null);
        setFamilyId(null);
        setFamily(null);
        setSettings(null);
        setChildrenList([]);
        setChildrenMissionsState({});
        setIsOnboarded(false);
        setIsLoading(false);
        return;
      }
      setFamilyId(fam.id);
      setFamily(fam);
      const [s, ch] = await Promise.all([api.fetchFamilySettings(fam.id), api.fetchChildren(fam.id)]);
      setSettings(s);
      setChildrenList(ch);
      const missions: Record<string, ChildMission[]> = {};
      await Promise.all(ch.map(async (c) => { missions[c.id] = await api.fetchChildMissions(c.id); }));
      setChildrenMissionsState(missions);
      setIsOnboarded(true);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!familyId) return;
    const channel = supabase
      .channel("family-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "family_settings", filter: `family_id=eq.${familyId}` },
        () => refetch()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "children", filter: `family_id=eq.${familyId}` },
        () => refetch()
      )
      .subscribe();
    subRef.current = () => supabase.removeChannel(channel);
    return () => subRef.current?.unsubscribe();
  }, [familyId, refetch]);

  const createFamily = useCallback(async () => {
    const { familyCode: code, familyId: id } = await api.createFamily();
    setFamilyCodeState(code);
    const fam = await api.fetchFamilyByCode(code);
    setFamily(fam!);
    setFamilyId(id);
    const s = await api.fetchFamilySettings(id);
    setSettings(s);
    setChildrenList([]);
    setChildrenMissionsState({});
    setIsOnboarded(true);
  }, []);

  const joinFamily = useCallback(async (code: string) => {
    const { familyId: id } = await api.joinFamily(code);
    setFamilyCodeState(api.getStoredFamilyCode());
    const fam = await api.fetchFamilyByCode(api.getStoredFamilyCode()!);
    setFamily(fam!);
    setFamilyId(id);
    await refetch();
    setIsOnboarded(true);
  }, [refetch]);

  const leaveFamily = useCallback(() => {
    api.clearStoredFamilyCode();
    setFamilyCodeState(null);
    setFamilyId(null);
    setFamily(null);
    setSettings(null);
    setChildrenList([]);
    setChildrenMissionsState({});
    setIsOnboarded(false);
  }, []);

  const updateSettings = useCallback(
    async (patch: { app_title?: string; target_count?: number }) => {
      if (!familyId) return;
      await api.updateFamilySettings(familyId, patch);
      const s = await api.fetchFamilySettings(familyId);
      setSettings(s);
    },
    [familyId]
  );

  const addChild = useCallback(
    async (child: { name: string; age: number; gender: Gender; icon: ProfileIconId }) => {
      if (!familyId) throw new Error("no family");
      const c = await api.addChild(familyId, child);
      const missions = await api.fetchChildMissions(c.id);
      setChildrenList((prev) => [...prev, c].sort((a, b) => a.sort_order - b.sort_order));
      setChildrenMissionsState((prev) => ({ ...prev, [c.id]: missions }));
      return c;
    },
    [familyId]
  );

  const updateChild = useCallback(
    async (childId: string, patch: { name?: string; age?: number; gender?: Gender; icon?: ProfileIconId }) => {
      await api.updateChild(childId, patch);
      const ch = await api.fetchChildren(familyId!);
      setChildrenList(ch);
    },
    [familyId]
  );

  const deleteChild = useCallback(
    async (childId: string) => {
      await api.deleteChild(childId);
      setChildrenList((prev) => prev.filter((c) => c.id !== childId));
      setChildrenMissionsState((prev) => {
        const next = { ...prev };
        delete next[childId];
        return next;
      });
    },
    []
  );

  const refreshMissions = useCallback(async (childId: string, age: number) => {
    await api.refreshChildMissions(childId, age);
    const missions = await api.fetchChildMissions(childId);
    setChildrenMissionsState((prev) => ({ ...prev, [childId]: missions }));
  }, []);

  const updateMission = useCallback(async (childId: string, slotIndex: number, text: string) => {
    await api.updateChildMission(childId, slotIndex, text);
    const missions = await api.fetchChildMissions(childId);
    setChildrenMissionsState((prev) => ({ ...prev, [childId]: missions }));
  }, []);

  const setChildrenMissions = useCallback((childId: string, missions: ChildMission[]) => {
    setChildrenMissionsState((prev) => ({ ...prev, [childId]: missions }));
  }, []);

  const value: FamilyContextValue = {
    familyCode,
    familyId,
    family,
    settings,
    children: childrenList,
    childrenMissions: childrenMissions,
    isLoading,
    isOnboarded,
    createFamily,
    joinFamily,
    leaveFamily,
    refetch,
    updateSettings,
    addChild,
    updateChild,
    deleteChild,
    refreshMissions,
    updateMission,
    setChildrenMissions,
  };

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

export function useFamily() {
  const c = useContext(FamilyContext);
  if (!c) throw new Error("useFamily must be used within FamilyProvider");
  return c;
}
