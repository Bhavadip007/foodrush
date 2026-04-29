"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const variants = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.61, 1, 0.88, 1] as [number, number, number, number] },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={variants} initial="initial" animate="enter" exit="exit">
      {children}
    </motion.div>
  );
}
