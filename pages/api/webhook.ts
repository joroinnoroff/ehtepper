
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-12-18.acacia",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;
    // verify the event
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("Checkout session completed:", session.id);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error("Webhook handler failed:", err);
    res.status(500).send(`Webhook handler failed. ${err.message}`);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
