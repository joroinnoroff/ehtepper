import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

const InfBanner = () => {
  const images = [
    { src: '/framermotion.webp', width: 50, height: 90, alt: 'Framer Motion' },
    { src: '/gsap.png', width: 110, height: 100, alt: 'GSAP' },
    { src: '/wplogo.png', width: 100, height: 100, alt: 'WordPress' },
    { src: '/nextjs.png', width: 100, height: 100, alt: 'Next.js' },
    { src: '/woo.webp', width: 100, height: 100, alt: 'WooCommerce' },
    { src: '/sanity.svg', width: 100, height: 100, alt: 'Sanity' },
    { src: '/adobe.png', width: 100, height: 100, alt: 'Adobe' },
    { src: '/figmalogo.png', width: 100, height: 100, alt: 'Figma' },
    { src: '/google.png', width: 110, height: 110, alt: 'Google' },
  ];

  const totalWidth = images.reduce((sum, image) => sum + image.width + 30, 0); // Total width of one set with gaps

  return (
    <div className="overflow-hidden my-5 cursor-help" title="techstack">
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