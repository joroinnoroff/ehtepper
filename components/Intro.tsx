import React, { useRef } from 'react';
import Image from 'next/image';

import { useScroll, useTransform, motion } from 'framer-motion';
import { ChevronDown, Scroll } from 'lucide-react';

export default function Intro(): JSX.Element {
  const container = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0vh', '150vh']);

  return (
    <div ref={container} className="h-[75vh]   overflow-hidden">
      <motion.div style={{ y }} className="relative h-full">
        <Image
          src={"/bg2bw.png"}
          fill
          alt="image"
          style={{ objectFit: 'cover' }}
        />


        <span className='absolute bottom-0 right-5 z-10 animate-pulse text-white flex flex-col items-center'>
          Scroll down
          <ChevronDown />
        </span>
      </motion.div>
    </div>
  );
}
