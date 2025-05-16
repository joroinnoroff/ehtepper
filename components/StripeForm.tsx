"use client";
import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import Bring from "./Bring";

declare global {
  interface Window {
    VippsCheckout?: any;
  }
}

export default function StripeForm() {
  const router = useRouter();
  const cartState = useAppSelector((state) => state.cart);


  const [loading, setIsLoading] = useState(false);


  const handleStripeCheckout = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/stripe-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify({
          items: cartState.lineItems,
        }),
      });

      const data = await response.json();


      if (response.ok && data.sessionId) {
        window.location.href = data.url;
      } else {
        toast.error("failed to initate stripe checkout");
      }
    } catch (error) {
      console.error("checkout error", error)
    } finally {
      setIsLoading(false);
    }
  }



  return (
    <div className="  w-full mx-auto ">



      <button onClick={handleStripeCheckout} className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-all">
        <Image src="/visa.png" width={60} height={60} alt="Vipps betaling" className="object-contain" />
      </button>
    </div>
  );
}
