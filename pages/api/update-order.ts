import { updateWooCommerceOrder } from "@/utils/woomerceApi";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { orderId } = req.query;
    const { set_paid, customerInformation, shippingInformation, shippingOption } = req.body;

    if (!orderId || typeof orderId !== "string") {
      return res.status(400).json({ message: "Missing or invalid orderId" });
    }

    const updateData: any = {};

    if (set_paid) updateData.set_paid = true;
    if (customerInformation) updateData.billing = customerInformation;
    if (shippingInformation) updateData.shipping = shippingInformation;

    if (shippingOption && typeof shippingOption === "object") {
      const { id, label, amount, bringId, deliveryInfo } = shippingOption;

      if (!id || !amount) {
        return res.status(400).json({ message: "ShippingOption mangler id eller amount" });
      }

      updateData.shipping_lines = [
        {
          method_id: "bring_hjem",
          method_title: label,
          total: (amount.total / 100).toFixed(2),
          meta_data: [
            { key: "bring_unique_id", value: bringId },
            { key: "delivery_info", value: deliveryInfo },
          ],
        },
      ];


      if (bringId) {
        updateData.shipping_lines[0].meta_data.push({
          key: "bring_unique_id",
          value: bringId,
        });
      }

      if (deliveryInfo) {
        updateData.shipping_lines[0].meta_data.push({
          key: "delivery_info",
          value: deliveryInfo,
        });
      }
    }

    const updatedOrder = await updateWooCommerceOrder(orderId, updateData);

    return res.status(200).json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error("🚨 Feil i update-order:", error);
    return res.status(500).json({ message: error.message || "Intern serverfeil" });
  }
}
