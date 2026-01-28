"use client";

import { FamilyProvider } from "@/contexts/FamilyContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <FamilyProvider>{children}</FamilyProvider>;
}
