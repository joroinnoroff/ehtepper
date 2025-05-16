"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/lib/hooks";
import toast from "react-hot-toast";
import Image from "next/image";

declare global {
  interface Window {
    VippsCheckout?: any;
  }
}

export default function ShippingForm() {
  const cartState = useAppSelector((state) => state.cart);

  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [vippsToken, setVippsToken] = useState<string | null>(null);
  const [checkoutFrontendUrl, setCheckoutFrontendUrl] = useState<string | null>(null);
  const [checkoutInstance, setCheckoutInstance] = useState<any>(null);
  const [vippsReference, setVippsReference] = useState<string | null>(null);
  const [orderInfo, setOrderInfo] = useState<{ wcOrderId: string; shippingOption?: any } | null>(null);
  const [iframeActive, setIframeActive] = useState(false);

  const [orderCreated, setOrderCreated] = useState(false);

  useEffect(() => {
    const loadVippsSDK = () => {
      if (!window.VippsCheckout) {
        const script = document.createElement("script");
        script.src = "https://checkout.vipps.no/vippsCheckoutSDK.js";
        script.async = true;
        script.onload = () => setSdkLoaded(true);
        script.onerror = () => console.error("❌ Vipps SDK failed to load");
        document.head.appendChild(script);
      } else {
        setSdkLoaded(true);
      }
    };

    loadVippsSDK();
  }, []);

  const startSession = async () => {
    const url = new URL(window.location.href);
    const existingReference = url.searchParams.get("vippsReference");
    const existingOrderId = url.searchParams.get("wcOrderId");

    if (existingReference && existingOrderId) {
      toast("En pågående betaling finnes allerede.");
      return;
    }

    if (cartState.lineItems.length === 0) {
      toast.error("Handlekurven er tom.");
      return;
    }

    try {
      const lineItemsData = cartState.lineItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.imageUrl
      }));

      // 🟢 1. Opprett tom WooCommerce-ordre
      const wooOrderResponse = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineItems: lineItemsData,
          customerInformation: { ...orderInfo },
          shippingOption: null,
        }),
      });

      if (!wooOrderResponse.ok) {
        const errorData = await wooOrderResponse.json();
        console.error("WooCommerce API error:", errorData);
        throw new Error(`Kunne ikke opprette WooCommerce-ordre: ${errorData.message || errorData}`);
      }


      const { wcOrderId } = await wooOrderResponse.json();

      url.searchParams.set("wcOrderId", wcOrderId);
      window.history.pushState({}, "", url.toString());

      // 🟠 2. Opprett Vipps-sesjon
      const vippsResponse = await fetch("/api/vipps-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineItems: lineItemsData,
          wcOrderId: wcOrderId,
        },),
      });

      if (!vippsResponse.ok) throw new Error("Kunne ikke opprette Vipps-sesjon.");

      const { checkoutFrontendUrl, token, reference } = await vippsResponse.json();
      setCheckoutFrontendUrl(checkoutFrontendUrl);
      setVippsToken(token);
      setIframeActive(true);
      setVippsReference(reference);

    } catch (error) {
      console.error("❌ Checkout Error:", error);
      toast.error("Kunne ikke starte betaling.");
    }
  };




  useEffect(() => {
    if (!sdkLoaded || !vippsToken || !checkoutFrontendUrl || !iframeActive || checkoutInstance) return;

    console.log("Initialiserer Vipps Checkout...");

    const url = new URL(window.location.href);
    const wcOrderId = url.searchParams.get("wcOrderId");

    const instance = new window.VippsCheckout({
      checkoutFrontendUrl,
      iFrameContainerId: "vipps-checkout-frame-container",
      token: vippsToken,
      checkoutConfiguration: {
        showOrderSummary: true,
      },
      language: "no",
      on: {
        session_status_changed: async (status: any,) => {
          console.log("📦 session_status_changed:", status);

          // Oppdater WooCommerce med shippingInfo her om status er PaymentSuccessful (se tidligere svar)

          await instance.unlock();

          if (status === "hasLogistics" == true) {
            console.log("has shipping")
          }
        },

        customer_information_changed: async (data: any) => {
          console.log("👤 Kundeinfo endret:", data);

          const url = new URL(window.location.href);
          const wcOrderId = url.searchParams.get("wcOrderId");

          if (!wcOrderId) return;

          if (wcOrderId === wcOrderId) return;

          try {
            await instance.lock();

            const response = await fetch(`/api/update-order?orderId=${wcOrderId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                customerInformation: {
                  first_name: data.firstName,
                  last_name: data.lastName,
                  email: data.email,
                  phone: data.phoneNumber,
                  address_1: data.address,
                  city: data.city,
                  postcode: data.zip,
                  country: data.country,
                },
                shippingInformation: {
                  first_name: data.firstName,
                  last_name: data.lastName,
                  email: data.email,
                  phone: data.phoneNumber,
                  address_1: data.address,
                  city: data.city,
                  postcode: data.zip,
                  country: data.country,
                },
                shippingOption: data.shippingOption || null,
              }),
            });

            if (!response.ok) {
              throw new Error("Kunne ikke oppdatere WooCommerce-ordre");
            }

            console.log("✅ WooCommerce-ordre oppdatert etter kundeinfo-endring");
          } catch (err) {
            console.error("❌ Feil ved oppdatering:", err);
          } finally {
            await instance.unlock();
          }
        },

        shipping_option_selected: async (data: any) => {
          console.log("🚚 Fraktvalg valgt:", data);

          const url = new URL(window.location.href);
          const wcOrderId = url.searchParams.get("wcOrderId");



          try {
            await instance.lock();

            const shippingPrice = data.price?.fractionalDenomination;
            const shippingMethod = data.brand;
            const bringId = data.id;


            // 1. Oppdater shipping i WooCommerce
            const shippingRes = await fetch("/api/update-shipping", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: wcOrderId,
                shippingPrice,
                shippingMethod,
                bringId,

              }),
            });

            if (!shippingRes.ok) {
              const errText = await shippingRes.text();
              throw new Error(`Feil ved oppdatering av frakt: ${errText}`);
            }

            console.log("✅ Frakt oppdatert");

            // 2. Rekalkuler totals i WooCommerce
            const recalcRes = await fetch(
              `https://bildeholder.art/wp-json/custom/v1/recalculate/${wcOrderId}`,
              { method: "POST" }
            );



          } catch (err) {
            console.error("❌ Feil i fraktvalg/rekalkulering:", err);
          } finally {
            await instance.unlock();
          }
        }

        ,


        total_amount_changed: async (data: any) => {
          console.log("💰 Total beløp endret:", data);
          await instance.unlock();



        }
      }
    });

    setCheckoutInstance(instance);
  }, [sdkLoaded, vippsToken, checkoutFrontendUrl, iframeActive, checkoutInstance, orderCreated, cartState.lineItems]);






  return (
    <div className="w-full mx-auto">
      {!iframeActive && (
        <button
          onClick={startSession}
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-all"
        >
          <Image src="/vipps.png" width={80} height={60} alt="Vipps betaling" />
        </button>
      )}

      {iframeActive && (
        <div id="vipps-checkout-frame-container" className="w-full h-full border mt-4"></div>
      )}
    </div>
  );
}
