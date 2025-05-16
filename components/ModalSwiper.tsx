import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info, X } from 'lucide-react';
import { Product } from '@/types/WooCommerceTypes';
import Link from 'next/link';

interface ModalSwiperProps {
  products: Product[];
  selectedProductId: number | null;
  onClose: () => void;
}

const ModalSwiper: React.FC<ModalSwiperProps> = ({ products, selectedProductId, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [current, setCurrent] = useState(
    products.findIndex((product) => product.id === selectedProductId)
  );
  const [imageStyles, setImageStyles] = useState<string[]>([]);

  useEffect(() => {
    const preloadImages = async () => {
      const styles = await Promise.all(
        products.map((product) => {
          const img = new Image();
          img.src = product.images[0]?.src || '/placeholder.jpg';

          return new Promise<string>((resolve) => {
            img.onload = () => {
              const aspectRatio = img.width / img.height;
              resolve(aspectRatio >= 1 ? 'object-cover' : 'object-contain');
            };
            img.onerror = () => resolve('object-cover');
          });
        })
      );

      setImageStyles(styles);
    };

    preloadImages();
  }, [products]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [current]);

  const handleDragEnd = (_event: any, info: { offset: { x: number } }) => {
    if (info.offset.x < -50 && current < products.length - 1) {
      setCurrent(current + 1); // Swipe left
    } else if (info.offset.x > 50 && current > 0) {
      setCurrent(current - 1); // Swipe right
    }
  };

  const handleDotClick = (imageIndex: number) => {
    setCurrentImageIndex(imageIndex);
  };

  if (selectedProductId === null) return null;
  const imageSrc = products[current].images[currentImageIndex]?.src || '/placeholder.jpg';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[9999]">
        <div className="relative w-full max-w-[90vw] md:max-w-[600px] xl:max-w-[60%] min-h-screen flex flex-col justify-center items-center ">
          <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
            <button
              className="absolute top-28 right-0 text-white text-xl z-10"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={40} />
            </button>
            <motion.div
              className="flex gap-4 flex-nowrap cursor-grab mb-4"
              animate={{ x: `calc(-${current * 100}% - ${current}rem)` }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
            >
              {products.map((product, idx) => (
                <motion.img
                  key={product.id}
                  src={imageSrc || '/placeholder.jpg'}
                  alt={product.name}
                  className={`sm:aspect-[16/9] min-h-[30vh] sm:h-[480px] md:h-full w-full ${imageStyles[idx] || 'object-cover'}`}
                  animate={{ opacity: idx === current ? 1 : 0.3 }}
                />
              ))}
            </motion.div>
            <div className="flex gap-2 w-full justify-center mt-4">
              {products[current].images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-white scale-110' : 'bg-gray-500'}`}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
            <Link href={`/Buy-art/${products[current].id}`} className='relative z-10 text-white flex items-center gap-2 tracking-widest my-5 text-lg' >
              <Info />
              <span onClick={onClose}>{products[current].name}</span>
            </Link>
            <div className="flex gap-2 w-full">
              {products.map((product, idx) => (
                <motion.img
                  key={product.id}
                  src={product.images[0]?.src || '/placeholder.jpg'}
                  alt={product.name}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: current === idx ? 1 : 0.5 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 lg:w-[5vw] h-10 lg:h-20 rounded-md mt-2 cursor-pointer object-cover"
                  onClick={() => setCurrent(idx)}
                />
              ))}
            </div>
          </MotionConfig>
        </div>
        <div className="controls absolute mx-auto w-full lg:w-3/5 ">
          <div className="flex justify-between">
            <button
              onClick={() => setCurrent(current - 1)}
              disabled={current === 0}
              className={`text-white text-2xl  ${current === 0 ? 'opacity-0' : ''}`}
            >
              <ChevronLeft size={50} />
            </button>
            <button
              onClick={() => setCurrent(current + 1)}
              disabled={current === products.length - 1}
              className={`text-white text-2xl  ${current === products.length - 1 ? 'opacity-0' : ''}`}
            >
              <ChevronRight size={50} />
            </button>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ModalSwiper;
