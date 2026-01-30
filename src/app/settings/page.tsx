"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFamily } from "@/contexts/FamilyContext";

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { family, children, addChild, updateChild, deleteChild } = useFamily();
  
  // 자녀 추가 모달 상태 (URL에 add=1이 있으면 자동으로 켭니다)
  const [isAdding, setIsAdding] = useState(searchParams.get("add") === "1");
  const [newName, setNewName] = useState("");
  const [newGender, setNewGender] = useState<"boy" | "girl">("boy");

  // 1. 자녀 추가 함수
  const handleAddChild = async () => {
    if (!newName.trim()) return alert("이름을 입력해주세요!");
    
    const success = await addChild({
      name: newName,
      gender: newGender,
      profile_icon_id: newGender === "boy" ? "dino" : "fairy" // 기본 아이콘 설정
    });

    if (success) {
      setNewName("");
      setIsAdding(false);
      router.replace("/settings"); // URL에서 ?add=1 제거
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] pb-20">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={() => router.push("/")} className="p-2 hover:bg-orange-50 rounded-full transition">
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">설정</h1>
        <div className="w-10" /> 
      </header>

      <main className="max-w-md mx-auto p-6 space-y-8">
        {/* 가족 정보 섹션 */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">가족 정보</h2>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-orange-100">
            <p className="text-lg font-bold text-gray-700">{family?.name || "우리집"} 칭찬판</p>
            <p className="text-sm text-gray-400 mt-1">가족 코드: {family?.family_code}</p>
          </div>
        </section>

        {/* 자녀 관리 섹션 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">자녀 목록</h2>
            <button 
              onClick={() => setIsAdding(true)}
              className="text-orange-500 flex items-center gap-1 text-sm font-bold"
            >
              <Plus size={18} /> 추가하기
            </button>
          </div>

          <div className="space-y-3">
            {children.length > 0 ? (
              children.map((child) => (
                <div key={child.id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-orange-50 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">
                      {child.gender === "boy" ? "🦖" : "✨"}
                    </div>
                    <span className="font-bold text-gray-700">{child.name}</span>
                  </div>
                  <button 
                    onClick={() => deleteChild(child.id)}
                    className="p-2 text-gray-300 hover:text-red-400 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white/50 rounded-3xl border-2 border-dashed border-orange-200">
                <p className="text-gray-400 text-sm">등록된 아이가 없어요.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* 자녀 추가 오버레이 (모달) */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 backdrop-blur-sm p-4"
          >
            <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-800">아이 등록하기</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 bg-gray-100 rounded-full text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">이름</label>
                  <input 
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="예: 준우, 지우"
                    className="w-full p-4 bg-orange-50 border-2 border-orange-100 rounded-2xl focus:outline-none focus:border-orange-400 text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">성별</label>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setNewGender("boy")}
                      className={`flex-1 p-4 rounded-2xl font-bold transition ${newGender === "boy" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-400"}`}
                    >
                      남자아이
                    </button>
                    <button 
                      onClick={() => setNewGender("girl")}
                      className={`flex-1 p-4 rounded-2xl font-bold transition ${newGender === "girl" ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-400"}`}
                    >
                      여자아이
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleAddChild}
                  className="w-full py-5 bg-orange-500 text-white rounded-3xl font-black text-xl shadow-lg shadow-orange-200 hover:bg-orange-600 active:scale-95 transition"
                >
                  등록 완료!
                </button>
              </div>
            </div>
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