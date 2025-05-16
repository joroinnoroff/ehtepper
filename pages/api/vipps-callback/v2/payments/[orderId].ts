import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId } = req.query;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = req.headers["callback-authorization-token"];
  const expectedToken = process.env.VIPPS_CALLBACK_AUTHORIZATION;

  if (token !== expectedToken) {
    console.warn("❌ Invalid callback token for Vipps.");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const body = req.body;
  console.log(`🔔 Callback mottatt for ordre ${orderId}:`, JSON.stringify(body, null, 2));

  // Her kan du gjøre noe med statusen:
  const sessionState = body?.sessionState;

  if (sessionState === "PaymentSuccessful") {
    console.log(`✅ Betaling fullført for ${orderId}`);
    // lagreOrder(reference, ...)
  }

  return res.status(200).end();
}
