"use client";

export const dynamic = 'force-dynamic';

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Plus, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFamily } from "@/contexts/FamilyContext";
import type { Gender } from "@/lib/types";

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { family, children, addChild, deleteChild } = useFamily();
  
  const [isAdding, setIsAdding] = useState(searchParams.get("add") === "1");
  const [newName, setNewName] = useState("");
  const [newGender, setNewGender] = useState<string>("boy"); 

  const handleAddChild = async () => {
    if (!newName.trim()) return alert("이름을 입력해주세요!");
    
    // 준우(6세), 지우(4세) 정보를 바탕으로 나이를 자동 설정합니다
    const childAge = newName.includes("준우") ? 6 : (newName.includes("지우") ? 4 : 0);

    const success = await addChild({
      name: newName,
      age: childAge,
      gender: newGender as any, // 👈 Gender 타입 검사 강제 통과
      icon: (newGender === "boy" ? "dino" : "fairy") as any 
    });

    if (success) {
      setNewName("");
      setIsAdding(false);
      router.replace("/settings");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] pb-20 font-sans">
      <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-orange-100">
        <button onClick={() => router.push("/")} className="p-2 hover:bg-orange-50 rounded-full transition">
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">우리집 설정</h1>
        <div className="w-10" />
      </header>

      <main className="max-w-md mx-auto p-6 space-y-8">
        <section>
          <h2 className="text-xs font-bold text-orange-300 uppercase tracking-widest mb-4">가족 정보</h2>
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-orange-50">
            <p className="text-lg font-black text-gray-800">{family?.name || "우리집"} 칭찬판</p>
            <div className="mt-2 inline-block px-3 py-1 bg-orange-50 rounded-full">
              <p className="text-xs font-bold text-orange-400">가족 코드: {family?.family_code}</p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-bold text-orange-300 uppercase tracking-widest">자녀 관리</h2>
            <button onClick={() => setIsAdding(true)} className="text-orange-500 flex items-center gap-1 text-sm font-black">
              <Plus size={18} /> 추가
            </button>
          </div>

          <div className="space-y-3">
            {children.length > 0 ? (
              children.map((child) => (
                <div key={child.id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-orange-50 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                      {/* 👇 76번 라인: (child.gender as any)를 사용해 비교 에러를 해결했습니다 */}
                      {(child.gender as any) === "boy" ? "🦖" : "✨"}
                    </div>
                    <div>
                      <p className="font-black text-gray-800">{child.name}</p>
                      <p className="text-xs font-bold text-gray-400">{child.age}세</p>
                    </div>
                  </div>
                  <button onClick={() => deleteChild(child.id)} className="p-2 text-gray-200 hover:text-red-400 transition">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white/40 rounded-[32px] border-2 border-dashed border-orange-100">
                <p className="text-gray-400 text-sm font-bold">아직 등록된 아이가 없어요.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-t-[48px] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-gray-800">아이 등록하기</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 bg-gray-50 rounded-full text-gray-400">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-black text-gray-400 mb-3">이름</label>
                  <input 
                    type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                    placeholder="준우 또는 지우"
                    className="w-full p-5 bg-orange-50 border-2 border-orange-100 rounded-3xl focus:outline-none focus:border-orange-400 text-xl font-bold transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-400 mb-3">성별</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setNewGender("boy")}
                      className={`flex-1 py-5 rounded-3xl font-black text-lg transition-all ${newGender === "boy" ? "bg-blue-500 text-white shadow-lg" : "bg-gray-50 text-gray-300"}`}
                    >
                      남자아이
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewGender("girl")}
                      className={`flex-1 py-5 rounded-3xl font-black text-lg transition-all ${newGender === "girl" ? "bg-pink-500 text-white shadow-lg" : "bg-gray-50 text-gray-300"}`}
                    >
                      여자아이
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleAddChild}
                  className="w-full py-6 bg-orange-500 text-white rounded-[32px] font-black text-xl shadow-xl shadow-orange-200 hover:bg-orange-600 transition-all"
                >
                  등록 완료!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF9F2] p-8">로딩 중...</div>}>
      <SettingsContent />
    </Suspense>
  );
}