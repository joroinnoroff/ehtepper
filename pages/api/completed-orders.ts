
import { NextApiRequest, NextApiResponse } from "next";
import { fetchWooCommerceOrders } from "@/utils/woomerceApi";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end("Metode ikke tillatt");
  }

  const { wcOrderId } = req.query;

  if (!wcOrderId || Array.isArray(wcOrderId)) {
    return res.status(400).json({ message: "wcOrderId mangler eller er ugyldig" });
  }

  try {
    const orders = await fetchWooCommerceOrders();
    const matchedOrder = orders.find((order: any) => order.id === parseInt(wcOrderId));

    if (!matchedOrder) {
      return res.status(404).json({ message: "Ordre ikke funnet" });
    }

    return res.status(200).json(matchedOrder);
  } catch (error: any) {
    console.error("❌ Feil ved henting av ordre:", error);
    return res.status(500).json({ message: "Feil ved henting av ordre" });
  }
}
