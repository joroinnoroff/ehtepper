import { Product } from '@/types/WooCommerceTypes';
import { motion } from 'framer-motion';
import { FullscreenIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import ModalSwiper from './ModalSwiper';
import Link from 'next/link';

interface ProductProps {
  products: Product[];
}

const BuyArt: React.FC<ProductProps> = ({ products }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const openModal = (id: number) => {
    setSelectedProductId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProductId(null);
    setIsModalOpen(false);
  };

  if (!products.length) {
    return (
      <div className="text-center mt-10 flex flex-col gap-6 items-center justify-center px-4">
        <div className="w-full h-[300px] bg-gray-300 rounded-md animate-pulse"></div>
      </div>
    );
  }

  console.log(products);

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-4 mx-auto ">
      {products.map((product) => (
        <motion.div
          key={product.id}
          className="relative w-full h-[400px] p-4 cursor-pointer"
        >
          <Link href={`/Buy-art/${product.id}`} className=''>
            {product.images.length > 0 && (
              <div className="relative w-full h-full">
                <Image
                  src={product.images[0].src}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
                {product.images.length > 1 && (
                  <Image
                    src={product.images[1].src}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 transition-opacity duration-300"
                  />
                )}
              </div>
            )}
          </Link>
          <div className="absolute bottom-0 left-0 w-fit gap-3 bg-zinc-800 hover:bg-purple-500 transition-all  bg-opacity-75  p-2 flex justify-around rounded-lg">
            <button
              title="View in fullscreen"
              onClick={() => openModal(product.id)}
              className="text-white"
            >
              <FullscreenIcon size={20} />
            </button>


            <Link href={`/Buy-art/${product.id}`} className='text-white transition-all tracking-widest font-lg'>{product.name}</Link>


            <span className='text-white text-xs'>{formatPrice(product.price)} Kr</span>
          </div>
        </motion.div>
      ))}

      {isModalOpen && selectedProductId !== null && (
        <ModalSwiper
          products={products}
          selectedProductId={selectedProductId}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default BuyArt;
