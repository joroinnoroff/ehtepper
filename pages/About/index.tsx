import { Product } from '@/types/WooCommerceTypes';
import React, { useEffect, useState } from 'react';

import BuyArt from '@/components/BuyArtGallery';
import Cart from '@/components/Cart';
import { useAppDispatch } from '@/lib/hooks';

import Link from 'next/link';
import FilterProducts from '@/components/FilterProducts';


interface ProductProps {
  products: Product[];
}

interface modalProps {
  modalOpen: boolean;

  setModalOpen: (open: boolean) => void;

  cartItems: any[];

}



export default function Home() {


  return (
    <main className="min-h-screen p-2 lg:p-10">
      <div className='mt-20 '>
        <h1 className="px-3 lg:px-5 2xl:px-10 text-6xl lg:text-9xl 2xl:text-[8.1vw] tracking-wide  pt-5 ">About </h1>
      </div>

      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione maxime cupiditate id quis magni earum aperiam beatae accusantium. Accusamus, cupiditate. Fuga amet dolorem fugit voluptatem iusto a facilis quas perferendis?</p>



    </main>
  );
}