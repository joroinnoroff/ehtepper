import { addLineItem, decrementLineItemQuantity, removeLineItem } from '@/lib/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { motion } from 'framer-motion';
import { ReceiptText, MinusIcon, PlusIcon, Trash } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Tilt from './Tilt';
import Link from 'next/link';
import Image from 'next/image';
import ShippingForm from './ShippingForm';
import Bring from './Bring';
import StripeForm from './StripeForm';


interface Props { }

const CheckoutItems = () => {



  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state) => state.cart);


  const [isMobile, setIsMobile] = useState(false);

  const [ispaying, setIspaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<null | "stripe" | "vipps">(null);


  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleResize();
    mediaQuery.addListener(handleResize);
    return () => {
      mediaQuery.removeListener(handleResize);
    };
  }, []);

  const handleUpdateQuantity = (productId: number, increment: boolean) => {
    const item = cartState.lineItems.find((lineItem) => lineItem.product_id === productId);
    if (!item) return;

    if (!increment && item.quantity === 1) {
      handleRemoveItem(productId);
      return;
    }

    dispatch(
      increment
        ? addLineItem({ ...item, quantity: 1 })
        : decrementLineItemQuantity({ product_id: productId, quantity: 1 })
    );
    toast.success("Quantity updated.");
  };

  const handleRemoveItem = (productId: number) => {
    const item = cartState.lineItems.find((lineItem) => lineItem.product_id === productId);
    if (item) {
      dispatch(removeLineItem({ product_id: productId, quantity: item.quantity }));
      toast.success("Removed item from Cart.");
    }
  };







  const total = cartState.lineItems.reduce((acc, item) => {
    const price = parseFloat(item?.price || "0");
    return acc + price * item.quantity;
  }, 0);

  const cartTotalQty = () => {
    return cartState.lineItems.reduce((acc: any, item: { quantity: any; }) => acc + item.quantity, 0);
  };



  return <>
    {cartState.lineItems.length === 0 ? (
      <>
        <p className="text-gray-500 tracking-widest">Your cart is empty</p>
        <Link href="/Buy-art" className="border border-zinc-600 px-3 py-3 rounded-md w-52 text-xl">Back to shop</Link>


        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } }}
          exit={{ opacity: 0 }}
          className=' flex gap-20 items-center my-2 lg:absolute h-full lg:h-fit bottom-0 z-50 w-80 mx-auto  '>
          <div className="paymentoptions flex items-center gap-2">
            <Image src={"/visa.png"} width={50} height={50} alt="visa" />
            <Image src={"/mastercard.png"} width={50} height={50} alt="visa" />
            <Image src={"/vipps.png"} width={50} height={50} alt="visa" />
          </div>
          <Link href={"/TermsofService"} className="terms text-xs hover:text-zinc-700 transition-all opacity-75 flex gap-2 items-center  ">
            <ReceiptText /> Salgsvilkår
          </Link>
        </motion.div>
      </>





    ) : (
      <>
        <div className='flex flex-col gap-10 lg:flex-row '>
          <div>
            <Tilt />
          </div>


          {!ispaying && (
            <div className='flex flex-col  '>
              <div className='flex flex-col   lg:min-w-[40vw]'>
                <ul className="mb-4 ">
                  Total items: {cartTotalQty()}
                  {cartState.lineItems.map((item) => (
                    <li
                      key={item.product_id}
                      className={` ${cartState.lineItems.indexOf(item) === cartState.lineItems.length - 1 ? "" : "border-b"} py-2`}
                    >
                      <div className="flex justify-between items-center">
                        <Image
                          src={item?.image || "/fallback-image.jpg"}
                          alt="cartimg"
                          height={120}
                          width={90}
                          className="rounded-md"
                        />
                        <div className="flex items-center flex-col w-80">
                          <p className="tracking-widest text-lg text-center">{item.name || "Product"}</p>
                          <span className="text-sm text-gray-500 ml-[4rem] text-center  flex">
                            {item.quantity} x {item.price} kr
                          </span>
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                          <button title="Decrease" onClick={() => handleUpdateQuantity(item.product_id, false)}>
                            <MinusIcon strokeWidth={1.25} />
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button title="Increase" onClick={() => handleUpdateQuantity(item.product_id, true)}>
                            <PlusIcon strokeWidth={1.25} />
                          </button>
                        </div>
                        <div className="col-span-1 text-right text-xs">
                          <button title="Remove" onClick={() => handleRemoveItem(item.product_id)}>
                            <Trash strokeWidth={1.25} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>


                <div className="flex justify-start gap-4 items-center border-t p-2 text-xl my-2">
                  <span className="font-semibold tracking-wide text-zinc-500">Total:</span>
                  {total} kr
                </div>

                <div className='border-t w-full border-zinc-400 pt-12 flex items-center gap-4 my-4 '>
                  <button onClick={() => setIspaying(true)} className='border rounded-md py-3 px-3 border-zinc-800 hover:bg-zinc-200'>Continue </button>
                  <button onClick={() => setIspaying(true)} className='hover:underline'>Shop more </button>
                </div>
              </div>
            </div>
          )}

          {ispaying && (
            <>
              <ShippingForm />




            </>
          )}

        </div>
      </>
    )}

  </>
}

export default CheckoutItems