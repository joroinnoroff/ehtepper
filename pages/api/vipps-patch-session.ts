
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { token, shippingAmount } = req.body;

  try {
    const response = await fetch(`https://apitest.vipps.no/checkout/v3/session/${token}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "client_id": process.env.VIPPS_CLIENT_ID!,
        "client_secret": process.env.VIPPS_CLIENT_SECRET!,
        "Ocp-Apim-Subscription-Key": process.env.VIPPS_SUBSCRIPTION_KEY!,
        "Merchant-Serial-Number": process.env.VIPPS_MSN!,
        "Vipps-System-Name": "Next.js Store",
        "Vipps-System-Version": "3.1.2",
        "Vipps-System-Plugin-Name": "Next.js Store",
        "Vipps-System-Plugin-Version": "4.5.6",
      },
      body: JSON.stringify({
        transaction: {
          amount: {
            value: shippingAmount,
            currency: "NOK",
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Feil ved session oppdatering:", errorText);
      return res.status(500).json({ message: errorText });
    }

    return res.status(200).json({ message: "Session oppdatert med ny total" });
  } catch (error: any) {
    console.error("❌ Uventet feil:", error.message);
    return res.status(500).json({ message: error.message });
  }
}
