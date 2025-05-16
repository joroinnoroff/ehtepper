
"use client"
import React, { useEffect, useState } from 'react';
import { addLineItem, decrementLineItemQuantity, removeLineItem } from '@/lib/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import toast from 'react-hot-toast';
import { MinusIcon, PlusIcon, ReceiptText, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Tilt from '@/components/Tilt';
import ShippingForm from '@/components/ShippingForm';
import { motion } from 'framer-motion';
import Head from 'next/head';
import CheckoutItems from '@/components/CheckoutItems';

declare global {
  interface Window {
    VippsCheckout?: any;
  }
}

const page = () => {






  return (
    <>

      <Head>
        <title>Checkout Page </title>


      </Head>
      <main className='min-h-screen p-3 xl:px-10  xl:max-w-4xl mx-auto'>
        <div className='mt-10  '>
          <h1 className="px-3 lg:px-5 2xl:px-10 text-6xl lg:text-9xl 2xl:text-[8.1vw] tracking-wide  pt-5 ">Checkout </h1>
        </div>


        <CheckoutItems />



      </main>

    </>
  );
};

export default page;