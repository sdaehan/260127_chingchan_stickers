"use client";

import { motion } from "framer-motion";
import { KidCard } from "./KidCard";
import type { Child } from "@/lib/types";
import { PROFILE_ICONS } from "@/lib/types";

type Props = { children: Child[] };

export function HomeCards({ children }: Props) {
  const iconMap = Object.fromEntries(PROFILE_ICONS.map((p) => [p.id, p.emoji]));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex w-full max-w-md flex-col gap-6 sm:gap-8"
    >
      {children.map((c, i) => (
        <KidCard
          key={c.id}
          name={c.name}
          icon={iconMap[c.icon] ?? "🌟"}
          href={`/child/${c.id}`}
          index={i}
        />
      ))}
    </motion.div>
  );
}
