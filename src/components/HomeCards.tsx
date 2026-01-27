"use client";

import { motion } from "framer-motion";
import { KidCard } from "./KidCard";

export function HomeCards() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 sm:gap-8"
    >
      <KidCard name="준우" icon="🦕" href="/junwoo" index={0} />
      <KidCard name="지우" icon="🤖" href="/jiwoo" index={1} />
    </motion.div>
  );
}
