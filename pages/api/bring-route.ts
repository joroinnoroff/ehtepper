import { NextApiRequest, NextApiResponse } from "next";
import { getBringShippingRate } from "@/utils/shipping";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.time("⏱️ Tid brukt i bring-route");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Metode ikke tillatt" });

  const address = req.body?.address || req.body;
  const postalCode = address?.postalCode || address?.zip || null;

  console.log("📬 Adresse mottatt fra Vipps:", JSON.stringify(address, null, 2));

  if (!postalCode) {
    console.timeEnd("⏱️ Tid brukt i bring-route");
    return res.status(400).json({ message: "Postnummer er påkrevd." });
  }

  try {
    const shippingOptions = await getBringShippingRate(postalCode, 1000, 30, 20, 10);

    const formattedOptions = shippingOptions.map((option, index) => ({
      brand: "OTHER",

      title: "Bring helt hjem ",
      taxRate: 2500,

      amount: { value: option.price, currency: "NOK" },
      id: `bringservicepakke-${option.uniqueId}`,

      priority: 1,
      isDefault: true,
      country: "NO",
      description: `${option.description} ${option.formattedExpectedDeliveryDate ? `Forventet levering: ${option.formattedExpectedDeliveryDate}` : ""}`.trim(),

    }));



    console.log("✅ Sender fraktalternativer til Vipps:", formattedOptions);
    console.timeEnd("⏱️ Tid brukt i bring-route");
    return res.status(200).json(formattedOptions);
  } catch (error: any) {
    console.error("❌ Feil ved henting av Bring-frakt:", error.message);
    console.timeEnd("⏱️ Tid brukt i bring-route");
    return res.status(500).json({ message: error.message || "Intern serverfeil" });
  }
}