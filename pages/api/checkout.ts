import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { createWooCommerceOrder } from "../../utils/woomerceApi";
import { Order } from "@/types/WooCommerceTypes";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-12-18.acacia" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { lineItems, shipping }: { lineItems: Order["line_items"], shipping: Order["billing"] } = req.body;

    if (!lineItems || lineItems.length === 0) {
      return res.status(400).json({ error: "No items in cart" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["NO", "SE", "DK"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Standard Shipping",
            type: "fixed_amount",
            fixed_amount: {
              amount: 5000,
              currency: "nok",
            },
          },
        },
      ],
      line_items: lineItems.map((item: any) => ({
        price_data: {
          currency: "nok",
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      metadata: {
        email: shipping.email,
        phone: shipping.phone,
        first_name: shipping.first_name,
        last_name: shipping.last_name,
        address_1: shipping.address_1,
        city: shipping.city,
        postcode: shipping.postcode,
        country: shipping.country,
        lineItems: JSON.stringify(lineItems),
      },
    });


    return res.status(200).json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
}