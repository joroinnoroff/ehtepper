import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

const images = [
  "/images/ps1/s1.jpg",
  "/images/ps1/s2.jpg",
  "/images/ps1/s3.jpg",
  "/images/ps1/s4.jpg",
  "/images/ps1/s5.jpg",
];

const HpSlider = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const totalWidth = images.length * 600; // Adjust based on the width of each image


  useEffect(() => {
    const track = document.getElementById('trackContainer');
    const handleScroll = () => {
      if (track) {
        setScrollPosition(track.scrollLeft);
      }
    };

    if (track) {
      track.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (track) {
        track.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);


  return (
    <>
      <div className='relative w-full h-[700px] overflow-scroll flex' id='trackContainer'>





        {images.map((image, index) => (
          <div key={index} className='relative w-[600px] h-full flex-shrink-0'>
            <Image src={image} alt='' layout='fill' objectFit='contain' />
          </div>
        ))}
      </div>
    </>
  );
};

export default HpSlider;
