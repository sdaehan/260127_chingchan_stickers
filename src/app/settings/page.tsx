"use client";

import { Suspense, useState, useCallback, useEffect, useRef } from "react"; // 1. Suspense 추가
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Copy, Plus, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useFamily } from "@/contexts/FamilyContext";

// 2. 기존의 'SettingsPage' 함수 이름을 'SettingsContent'로 바꿉니다.
function SettingsContent() {
  // ... (기존에 있던 useState, useSearchParams, useEffect 등 모든 로직을 그대로 두세요)
  const searchParams = useSearchParams();
  // ... (기존 return 문 끝까지 그대로 유지)
  return (
    <div className="min-h-screen bg-[#FFF9F2] pb-20">
      {/* 기존 JSX 내용 전체 */}
    </div>
  );
}

// 3. 진짜 페이지로 내보낼(export) 부분을 아래와 같이 작성합니다.
export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF9F2] p-8">로딩 중...</div>}>
      <SettingsContent />
    </Suspense>
  );
}