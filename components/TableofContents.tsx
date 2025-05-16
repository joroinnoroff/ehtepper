import { TOCContext } from '@/utils/TOCContext';
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import React, { useContext, useState } from 'react'

interface Props { }

const TableofContents = () => {
  const { sections, activeSection } = useContext(TOCContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleVisibility = () => {
    setIsOpen(!isOpen);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };
  const { scrollYProgress } = useScroll();

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);


  const [showTOC, setShowTOC] = useState(activeSection >= 0)

  scrollYProgress.on('change', (val) => {
    setShowTOC(activeSection >= 1);
  })


  return (
    <div className='h-full px-4 max-w-xs '>


      <motion.div

        animate={{ opacity: 1 }}

        className='fixed top-52 h-[80vh] py-32 flex gap-4 '>
        <div className='h-full w-1 bg-neutral-400 rounded-full overflow-hidden'>
          <motion.div className='bg-[#f01af8] w-full origin-top' style={{ height: progressHeight }} />
        </div>
        <div className='hidden lg:flex flex-col  '>
          <button onClick={toggleVisibility} className='flex items-center gap-2 relative z-20 tracking-wider w-fit'>Content {isOpen ? (<ChevronDown />) : <ChevronUp />}</button>
          <motion.div
            className='flex flex-col gap-6'

            initial="visible"
            animate={isOpen ? "hidden" : "visible"}
            variants={containerVariants}
          >
            {sections.map(({ id, title }) => (
              <motion.span
                variants={itemVariants}
                key={id}
                className={`cursor-pointer w-fit  transition-colors duration-200 tracking-widest text-xs xl:text-sm 2xl:text-xl font-mono ${activeSection === id ? 'text-neutral-900 bg-[#e078e3] p-1 rounded-xl' : 'text-neutral-500'}`}
                onClick={() => document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: "smooth" })}
              >
                {title}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default TableofContents;
