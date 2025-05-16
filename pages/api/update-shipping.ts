import { updateWooCommerceOrder } from "@/utils/woomerceApi";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return res.status(405).end("Only PUT allowed");

  const { orderId, shippingPrice, shippingMethod, bringId, deliveryInfo } = req.body;

  console.log("📦 Mottatt data fra frontend:");
  console.log({
    orderId,
    shippingPrice,
    shippingMethod,
    bringId,
    deliveryInfo,
  });

  if (!orderId || !shippingPrice || !shippingMethod) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updateData = {
      shipping_lines: [
        {
          method_id: "bring_hjem",
          method_title: shippingMethod,
          total: (shippingPrice / 100).toFixed(2),
          meta_data: [
            { key: "bring_unique_id", value: bringId },
            { key: "delivery_info", value: deliveryInfo },
          ],
        },
      ],
    };

    console.log("🚀 Sender følgende data til WooCommerce:");
    console.dir(updateData, { depth: null });

    const updatedOrder = await updateWooCommerceOrder(orderId, updateData);

    console.log("✅ WooCommerce svarte med:");
    console.dir(updatedOrder, { depth: null });

    return res.status(200).json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error("❌ Feil ved oppdatering av frakt:", error);
    return res.status(500).json({ message: error.message });
  }
}