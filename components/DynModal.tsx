
import React, { ReactNode, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';

interface DynModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  children: ReactNode;
}

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

const DynModal: React.FC<DynModalProps> = ({ isOpen, toggleModal, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={toggleModal}>
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 relative max-h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <button className="absolute top-52 text-5xl right-2 text-gray-500 hover:text-gray-700" onClick={toggleModal}>
          &times;
        </button>
        {children}
      </motion.div>
    </div>
  );
};

export default DynModal;