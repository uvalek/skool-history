"use client";

import { motion } from "framer-motion";

interface HandWrittenTitleProps {
  title?: string;
  subtitle?: string;
  strokeColor?: string;
}

function HandWrittenTitle({
  title = "Hand Written",
  subtitle = "Optional subtitle",
  strokeColor = "text-black dark:text-white",
}: HandWrittenTitleProps) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2.5, ease: [0.43, 0.13, 0.23, 0.96] as [number, number, number, number] },
        opacity: { duration: 0.5 },
      },
    },
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto py-20 md:py-24">
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.svg
          viewBox="0 0 1000 500"
          initial="hidden"
          animate="visible"
          className="w-[110%] h-[110%] -mt-2"
          style={{ overflow: "visible" }}
        >
          <title>{title}</title>
          <motion.path
            d="M 820 20
               C 1100 80, 1080 470, 500 490
               C -60 490, -80 80, 500 20
               C 700 20, 820 60, 850 90"
            fill="none"
            strokeWidth="10"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={draw}
            className={`${strokeColor} opacity-90`}
          />
        </motion.svg>
      </div>
      <div className="relative text-center z-10 flex flex-col items-center justify-center px-8">
        <motion.h1
          className="text-4xl md:text-6xl text-ds-on-surface tracking-tighter flex items-center gap-2 font-headline font-extrabold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="text-lg md:text-xl text-ds-on-surface-variant mt-3 max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}

export { HandWrittenTitle };
