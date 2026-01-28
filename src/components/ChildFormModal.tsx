"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useFamily } from "@/contexts/FamilyContext";
import { getRecommendedMissions } from "@/lib/missions";
import { PROFILE_ICONS, type Gender } from "@/lib/types";
import type { Child, ChildMission } from "@/lib/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  editChild: Child | null;
  missions: ChildMission[];
};

const GENDERS: { value: Gender; label: string }[] = [
  { value: "male", label: "남" },
  { value: "female", label: "여" },
  { value: "other", label: "그 외" },
];

export function ChildFormModal({ isOpen, onClose, editChild, missions }: Props) {
  const { addChild, updateChild, refreshMissions, updateMission } = useFamily();
  const [name, setName] = useState("");
  const [age, setAge] = useState(7);
  const [gender, setGender] = useState<Gender>("male");
  const [icon, setIcon] = useState<(typeof PROFILE_ICONS)[number]["id"]>("dino");
  const [rec, setRec] = useState(["", "", ""]);
  const [custom, setCustom] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!editChild;

  useEffect(() => {
    if (!isOpen) return;
    if (editChild) {
      setName(editChild.name);
      setAge(editChild.age);
      setGender(editChild.gender);
      setIcon(editChild.icon as (typeof PROFILE_ICONS)[number]["id"]);
      const m = missions.filter((x) => !x.is_custom).sort((a, b) => a.slot_index - b.slot_index);
      setRec([m[0]?.mission_text ?? "", m[1]?.mission_text ?? "", m[2]?.mission_text ?? ""]);
      setCustom(missions.find((x) => x.is_custom)?.mission_text ?? "");
    } else {
      setName("");
      setAge(7);
      setGender("male");
      setIcon("dino");
      const [a, b, c] = getRecommendedMissions(7);
      setRec([a, b, c]);
      setCustom("");
    }
    setError("");
  }, [isOpen, editChild, missions]);

  const handleRefresh = async () => {
    if (!editChild) {
      const [a, b, c] = getRecommendedMissions(age);
      setRec([a, b, c]);
      return;
    }
    setSaving(true);
    try {
      await refreshMissions(editChild.id, age);
      // missions prop will update from context; useEffect will sync rec
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimName = name.trim();
    if (!trimName) {
      setError("이름을 입력해 주세요.");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await updateChild(editChild.id, { name: trimName, age, gender, icon });
        await updateMission(editChild.id, 3, custom.trim());
        for (let i = 0; i < 3; i++) await updateMission(editChild.id, i, (rec[i] ?? "").trim());
      } else {
        const c = await addChild({ name: trimName, age, gender, icon });
        await updateMission(c.id, 3, custom.trim());
        for (let i = 0; i < 3; i++) {
          const t = (rec[i] ?? "").trim();
          if (t) await updateMission(c.id, i, t);
        }
      }
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장에 실패했어요.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        >
          <h2 className="mb-4 text-xl font-bold text-amber-900">{isEdit ? "자녀 수정" : "자녀 추가"}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-amber-800">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-amber-200/80 bg-amber-50/50 px-4 py-2.5 text-amber-900 focus:border-amber-400 focus:outline-none"
                placeholder="이름"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-amber-800">나이 (1~20세)</label>
              <input
                type="number"
                min={1}
                max={20}
                value={age}
                onChange={(e) => setAge(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
                className="w-full rounded-xl border border-amber-200/80 bg-amber-50/50 px-4 py-2.5 text-amber-900 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-amber-800">성별</label>
              <div className="flex gap-2">
                {GENDERS.map((g) => (
                  <label key={g.value} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value={g.value}
                      checked={gender === g.value}
                      onChange={() => setGender(g.value)}
                      className="text-amber-600"
                    />
                    <span className="text-amber-900">{g.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-amber-800">프로필 아이콘</label>
              <div className="flex flex-wrap gap-2">
                {PROFILE_ICONS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setIcon(p.id)}
                    className={`rounded-xl border-2 p-2 text-2xl transition ${
                      icon === p.id ? "border-amber-500 bg-amber-100" : "border-amber-200/60 bg-white hover:bg-amber-50"
                    }`}
                    title={p.label}
                  >
                    {p.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-amber-800">추천 미션 3개</label>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={saving}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-amber-700 hover:bg-amber-100"
                  title="다른 미션으로 바꾸기"
                >
                  <RefreshCw size={14} /> 새로고침
                </button>
              </div>
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <input
                    key={i}
                    type="text"
                    value={rec[i]}
                    onChange={(e) => {
                      const n = [...rec];
                      n[i] = e.target.value;
                      setRec(n);
                    }}
                    className="w-full rounded-xl border border-amber-200/80 bg-amber-50/50 px-4 py-2 text-amber-900 focus:border-amber-400 focus:outline-none"
                    placeholder={`미션 ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-amber-800">직접 입력 미션</label>
              <input
                type="text"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                className="w-full rounded-xl border border-amber-200/80 bg-amber-50/50 px-4 py-2 text-amber-900 focus:border-amber-400 focus:outline-none"
                placeholder="원하는 미션을 적어 주세요"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-amber-200/80 py-2.5 font-medium text-amber-800 hover:bg-amber-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-amber-400 py-2.5 font-semibold text-amber-900 hover:bg-amber-500 disabled:opacity-60"
              >
                {saving ? "저장 중…" : isEdit ? "수정" : "추가"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
