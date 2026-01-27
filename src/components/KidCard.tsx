"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  name: string;
  icon: string;
  href: string;
  index: number;
};

export function KidCard({ name, icon, href, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        href={href}
        className="block rounded-3xl border-2 border-amber-200/80 bg-white p-6 shadow-lg shadow-amber-200/30 transition hover:shadow-xl hover:shadow-amber-200/40 sm:p-8"
      >
        <span className="mb-3 block text-5xl sm:text-6xl" role="img" aria-hidden>
          {icon}
        </span>
        <h2 className="text-xl font-bold text-amber-900 sm:text-2xl">{name}</h2>
        <p className="mt-1 text-sm text-amber-600/80">스티커 모으기</p>
      </Link>
    </motion.div>
  );
}
