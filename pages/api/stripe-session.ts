import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { session_id } = req.query;

    if (!session_id || typeof session_id !== "string") {
      return res.status(400).json({ error: "Missing or invalid session_id" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    return res.status(200).json(session);
  } catch (error) {
    console.error("Stripe Session Retrieval Error:", error);
    return res.status(500).json({ error: "Failed to retrieve Stripe session" });
  }
}
