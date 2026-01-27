"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "chingchan_stickers";

export type ChildId = "junwoo" | "jiwoo";

function loadAll(): Record<ChildId, number> {
  if (typeof window === "undefined")
    return { junwoo: 0, jiwoo: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { junwoo: 0, jiwoo: 0 };
    const parsed = JSON.parse(raw) as Record<string, number>;
    return {
      junwoo: Math.min(10, Math.max(0, Number(parsed.junwoo) || 0)),
      jiwoo: Math.min(10, Math.max(0, Number(parsed.jiwoo) || 0)),
    };
  } catch {
    return { junwoo: 0, jiwoo: 0 };
  }
}

function save(data: Record<ChildId, number>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function useStickerStorage(childId: ChildId) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const all = loadAll();
    setCount(all[childId]);
  }, [childId]);

  const addSticker = useCallback(
    (onUpdate?: (newCount: number) => void) => {
      setCount((c) => {
        const next = Math.min(10, c + 1);
        const all = loadAll();
        all[childId] = next;
        save(all);
        onUpdate?.(next);
        return next;
      });
    },
    [childId]
  );

  return { count, addSticker };
}
