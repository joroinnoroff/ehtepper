import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

const InfBanner = () => {
  const images = [
    { src: '/tif.png', width: 50, height: 90, alt: 'Framer Motion' },
    { src: '/bolgenmoi.png', width: 110, height: 100, alt: 'GSAP' },
    { src: '/fog.png', width: 100, height: 100, alt: 'WordPress' },

  ];

  const totalWidth = images.reduce((sum, image) => sum + image.width + 30, 0); // Total width of one set with gaps

  return (
    <div className="overflow-hidden my-5 cursor-help" title="Previous Exhibitions">
      <motion.div
        className="flex"
        animate={{ x: `-${totalWidth}px` }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: 'linear',
        }}
        style={{
          display: 'flex',
          willChange: 'transform',
          gap: '30px',
        }}
      >
        {images.concat(images).map((image, index) => (
          <Image
            key={index}
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
            className="object-contain grayscale"
          />
        ))}
      </motion.div>
    </div>
  );
};

export default InfBanner;