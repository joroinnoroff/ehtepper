import { WordpressPost } from '@/types/WordpressTypes';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react'

interface CustomCardsProps {
  posts: WordpressPost[];
}

const CustomCards: React.FC<CustomCardsProps> = ({ posts }) => {

  const allCategories = posts.flatMap(post => post.categories);
  const uniqueCategoryNames = Array.from(
    //@ts-ignore
    new Set(allCategories.map(category => category.name))
  );

  const containerVariants = {
    visible: { opacity: 1, transition: { staggerChildren: 0.4 } },
    hidden: { opacity: 0 },
  };

  const itemVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 },
  };
  if (posts.length === 0) {
    return <div className="h-full w-full px-5">
      <div className='flex gap-4 items-center'>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className='border border-zinc-400 h-80 w-80 flex items-center justify-center relative overflow-hidden cursor-pointer my-28 animate-pulse'
          >
            <div className='bg-gray-300 h-full w-full flex items-center justify-center'>
              <div className=' w-12 h-2 rounded-md bg-zinc-800'>

              </div>
            </div>
          </div>
        ))}
      </div>

    </div>;
  }
  return (
    <div className='min-h-[70vh] h-auto w-full px-5'>
      <motion.div className='flex gap-4 items-center '
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}>
        {uniqueCategoryNames
          .filter(categoryName => categoryName !== "Projects")
          .map((categoryName, index) => (
            <motion.div key={index} className='border border-zinc-400 h-80 w-80 flex items-center justify-center relative overflow-hidden cursor-pointer my-28'
              variants={itemVariants}>
              <Image src={"/fip1.jpg"} alt='' fill className='object-cover opacity-50 transition-all hover:scale-105 hover:opacity-65' />
              <p className='relative z-5'>{categoryName}</p>
            </motion.div>
          ))}
      </motion.div>
    </div>
  );
};

export default CustomCards;