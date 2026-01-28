"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useFamily } from "@/contexts/FamilyContext";
import { Onboarding } from "@/components/Onboarding";
import { EditableTitle } from "@/components/EditableTitle";
import { HomeCards } from "@/components/HomeCards";

export default function Home() {
  const { isLoading, isOnboarded, settings, children, updateSettings } = useFamily();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-amber-50/90 to-amber-100/80">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 rounded-full border-2 border-amber-300 border-t-amber-600"
        />
      </div>
    );
  }

  if (!isOnboarded) {
    return <Onboarding />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-amber-50/90 via-orange-50/50 to-amber-100/80">
      <header className="flex items-center justify-between gap-2 border-b border-amber-200/60 bg-white/70 px-4 py-3 backdrop-blur-sm">
        <div className="min-w-0 flex-1" />
        <div className="flex min-w-0 flex-[2] justify-center">
          <EditableTitle
            value={settings?.app_title ?? "우리집 칭찬스티커"}
            onChange={(v) => updateSettings({ app_title: v })}
            placeholder="우리집 칭찬스티커"
          />
        </div>
        <Link
          href="/settings"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-amber-700 transition hover:bg-amber-100"
          aria-label="설정"
        >
          <Settings size={22} />
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 py-8">
        <HomeCards children={children} />
      </main>
    </div>
  );
}
