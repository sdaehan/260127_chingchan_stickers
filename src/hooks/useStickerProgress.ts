"use client";

import { useCallback, useEffect, useState } from "react";
import * as api from "@/lib/family-api";

export function useStickerProgress(childId: string | null) {
  const [lastReset, setLastReset] = useState<string | null>(null);
  const [events, setEvents] = useState<{ mission_text: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!childId) return;
    const since = await api.fetchLastResetAt(childId);
    setLastReset(since);
    const list = await api.fetchStickerEventsSince(childId, since);
    setEvents(list);
    setLoading(false);
  }, [childId]);

  useEffect(() => {
    if (!childId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    refetch();
  }, [childId, refetch]);

  const count = events.length;

  const addSticker = useCallback(
    async (missionText: string) => {
      if (!childId || !missionText.trim()) return;
      await api.addStickerEvent(childId, missionText.trim());
      setEvents((prev) => [
        { mission_text: missionText.trim(), created_at: new Date().toISOString() },
        ...prev,
      ]);
    },
    [childId]
  );

  const reset = useCallback(async () => {
    if (!childId) return;
    await api.addChildReset(childId);
    setLastReset(new Date().toISOString());
    setEvents([]);
  }, [childId]);

  return { count, events, loading, addSticker, reset, refetch };
}
