'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

/**
 * Варианты анимации для имитации перелистывания страницы старой книги.
 * Включает эффект затухания и небольшого скольжения, а также "проявление" контента.
 */
const pageVariants = {
  initial: {
    opacity: 0,
    x: 20,
    filter: 'blur(10px) sepia(0.5)',
  },
  enter: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px) sepia(0)',
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1], // Плавный выезд
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    filter: 'blur(10px) sepia(0.5)',
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * Варианты для эффекта "чернильного пятна" или проявления текста.
 */
const inkVariants = {
  initial: { opacity: 0, scale: 0.95 },
  enter: { 
    opacity: 1, 
    scale: 1,
    transition: { delay: 0.2, duration: 1 } 
  }
};

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        className="w-full h-full relative"
      >
        <motion.div variants={inkVariants}>
          {children}
        </motion.div>
        
        {/* Декоративный эффект "старой бумаги" при переходе */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.05, 0] }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none absolute inset-0 bg-[#f4e4bc] mix-blend-multiply z-50"
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-paper.png")' }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
