"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
};

export function EditableTitle({ value, onChange, placeholder = "제목", className = "" }: Props) {
  const [editing, setEditing] = useState(false);
  const [tmp, setTmp] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTmp(value);
  }, [value]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const save = () => {
    const t = tmp.trim() || placeholder;
    setTmp(t);
    if (t !== value) onChange(t);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={tmp}
        onChange={(e) => setTmp(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => e.key === "Enter" && save()}
        className={`w-full rounded-lg border-2 border-amber-300 bg-white px-3 py-1.5 text-center text-xl font-bold text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-400 ${className}`}
      />
    );
  }

  return (
    <motion.button
      type="button"
      onClick={() => setEditing(true)}
      className={`block w-full text-center outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 rounded-lg ${className}`}
      whileTap={{ scale: 0.99 }}
    >
      <span className="text-2xl font-bold text-amber-900 sm:text-3xl">{value || placeholder}</span>
      <span className="ml-1.5 inline-block text-amber-500/70 text-lg align-middle">✏️</span>
    </motion.button>
  );
}
