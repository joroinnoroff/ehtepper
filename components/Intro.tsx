import React, { useRef } from 'react';
import Image from 'next/image';

import { useScroll, useTransform, motion } from 'framer-motion';

export default function Intro(): JSX.Element {
  const container = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0vh', '150vh']);

  return (
    <div ref={container} className="h-[60vh]   overflow-hidden">
      <motion.div style={{ y }} className="relative h-full">
        <Image
          src={"/bg2.png"}
          fill
          alt="image"
          style={{ objectFit: 'cover' }}
        />
      </motion.div>
    </div>
  );
}
