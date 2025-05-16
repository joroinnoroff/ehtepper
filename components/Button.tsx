import React, { useState } from "react";
import { motion } from "framer-motion";
import { MoveUpLeft, MoveUpRight } from "lucide-react";

const DURATION = 0.25;
const STAGGER = 0.025;

export const Button: React.FC = () => {
  return (
    <section className="grid place-content-start gap-1    w-fit px-3 rounded-md">

      <p className="text-2xl tracking-widest">Hi I&apos;m </p>
      <FlipText>Monica</FlipText>
      <div className="flex gap-4 items-center">
        <FlipText> Winther </FlipText>
        <MoveUpRight />
      </div>
    </section>
  );
};

const FlipText: React.FC<{ children: string }> = ({ children }) => {
  const [isToggled, setIsToggled] = useState(false);
  const isLargeScreen = typeof window !== "undefined" && window.innerWidth >= 1200;

  return (
    <motion.div
      initial="initial"
      whileHover={isLargeScreen ? "hovered" : undefined}
      whileInView="hovered"
      onClick={() => !isLargeScreen && setIsToggled(!isToggled)}
      animate={isToggled ? "hovered" : "initial"}
      className="relative block h-fit whitespace-nowrap text-5xl lg:text-[15.1vw] 2xl:text-[12vw] text-[#ba54b0]   font-bold overflow-hidden cursor-pointer"
    >
      <FlipContent>{children}</FlipContent>
    </motion.div>
  );
};

const FlipContent: React.FC<{ children: string }> = ({ children }) => {
  return (
    <>
      <div className="h-full">
        {children.split("").map((l, i) => (
          <motion.span
            key={i}
            variants={{
              initial: { y: 0, opacity: 1 },
              hovered: { y: "100%", opacity: 1 },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block min-h-full"
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0 h-full">
        {children.split("").map((l, i) => (
          <motion.span
            key={i}
            variants={{
              initial: { y: "-100%", opacity: 0 },
              hovered: { y: 0, opacity: 1 },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            className="inline-block"
          >
            {l}
          </motion.span>
        ))}
      </div>
    </>
  );
};