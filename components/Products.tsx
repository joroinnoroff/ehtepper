import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

interface Product {
  id: number;
  image: string | StaticImport;
  title: string;
  price: number;
  stock: number;
}

interface ProductsProps {
  products: Product[];
}

const Products = ({ products }: ProductsProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="work" className="relative flex flex-col items-center justify-between mt-20 min-h-screen p-4 sm:p-8 md:p-24 FONT2">
      <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full"
            initial="hidden"
            whileInView="visible"
            variants={{
              visible: { opacity: 1, transition: { staggerChildren: 0.4 } },
              hidden: { opacity: 0 },
            }}
          >
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                className="relative w-full h-[380px] cursor-pointer rounded-md overflow-hidden"
                onHoverStart={() => setHoveredIndex(idx)}
                onHoverEnd={() => setHoveredIndex(null)}
                variants={{
                  visible: { opacity: 1, x: 0 },
                  hidden: { opacity: 0, x: -20 },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/Art/${product.id}`}>
                  <Image
                    draggable={false}
                    src={product.image}
                    alt={`Art ${product.id}`}
                    fill={true}
                    style={{ objectFit: 'contain' }}
                  />
                  <motion.div
                    className="absolute inset-0 z-10 bg-[#f01af8]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredIndex === idx ? 0.6 : 0 }}
                    transition={{ opacity: { duration: 0.3 } }}
                  />
                  <motion.span
                    className="absolute inset-0 flex justify-center items-center opacity-0 text-white text-4xl font-bold uppercase"
                    animate={{ opacity: hoveredIndex === idx ? 1 : 0 }}
                    transition={{ opacity: { duration: 0.3 } }}
                  >
                    {product.title}
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </MotionConfig>
    </section>
  );
};

export default Products;
