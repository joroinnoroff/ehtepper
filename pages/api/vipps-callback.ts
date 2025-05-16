import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// Hent detaljer fra Vipps-sesjon
const fetchSessionDetails = async (sessionId: string) => {
  try {
    const url = `https://apitest.vipps.no/checkout/v3/session/${sessionId}`;

    const headers = {
      "Vipps-System-Name": "Next.js Store",
      "Vipps-System-Version": "3.1.2",
      "Vipps-System-Plugin-Name": "Next.js Store",
      "Vipps-System-Plugin-Version": "4.5.6",
      "client_id": process.env.VIPPS_CLIENT_ID!,
      "client_secret": process.env.VIPPS_CLIENT_SECRET!,
      "Ocp-Apim-Subscription-Key": process.env.VIPPS_SUBSCRIPTION_KEY!,
      "Merchant-Serial-Number": process.env.VIPPS_MSN!,
    };

    console.log("📡 Henter session fra Vipps:", url);
    console.log("📋 Headers:", headers);

    const response = await axios.get(url, { headers });

    console.log("✅ Vipps session respons:", response.data);

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Feil fra Vipps (axios):", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    } else {
      console.error("❌ Ukjent feil ved henting av Vipps session:", error);
    }
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end("Metode ikke tillatt");
  }

  try {
    const { sessionId, sessionState, reference, wcOrderId } = req.body;

    console.log("🔄 Mottok Vipps callback:", JSON.stringify(req.body, null, 2));

    if (!sessionId || !wcOrderId) {
      console.warn("⚠️ Mangler sessionId eller wcOrderId");
      return res.status(400).json({ message: "Mangler sessionId eller wcOrderId" });
    }

    if (sessionState !== "PaymentSuccessful") {
      console.log("⚠️ Betaling ikke fullført. Ingen endringer.");
      return res.status(200).json({ message: "Betaling ikke fullført." });
    }

    const sessionDetails = await fetchSessionDetails(sessionId);
    if (!sessionDetails) {
      return res.status(500).json({ message: "Kunne ikke hente sesjonsdetaljer fra Vipps" });
    }

    const billing = sessionDetails.billingDetails;
    const shipping = sessionDetails.shippingDetails;

    const customerInformation = {
      first_name: billing.firstName,
      last_name: billing.lastName,
      email: billing.email,
      phone: billing.phoneNumber,
      address_1: billing.streetAddress,
      city: billing.city,
      postcode: billing.postalCode,
      country: billing.country,
    };

    const shippingInformation = {
      first_name: shipping.firstName,
      last_name: shipping.lastName,
      address_1: shipping.streetAddress,
      city: shipping.city,
      postcode: shipping.postalCode,
      country: shipping.country,
      email: shipping.email,
      phone: shipping.phoneNumber,
    };

    const shippingOption = shipping.shippingMethodId || null;

    console.log("📦 Oppdaterer WooCommerce ordre:", wcOrderId);
    console.log("➡️ Payload til WooCommerce:", {
      set_paid: true,
      customerInformation,
      shippingInformation,
      shippingOption,
    });

    const totalAmount = sessionDetails.orderDetails.amount.total; // Vipps gir beløp i øre

    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/update-order?orderId=${wcOrderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        set_paid: true,
        customerInformation,
        shippingInformation,
        shippingOption,
        totalAmount: totalAmount / 100,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("❌ Feil ved oppdatering av ordre:", response.status, responseText);
      throw new Error(`Feil ved oppdatering av ordre: ${responseText}`);
    }

    console.log("✅ Ordre oppdatert og markert som betalt:", wcOrderId, responseText);

    return res.status(200).json({
      success: true,
      message: "Ordre oppdatert som betalt",
      wcOrderId,
    });
  } catch (error: any) {
    console.error("🚨 Feil i vipps-callback:", error.message);
    return res.status(500).json({ message: error.message || "Intern serverfeil" });
  }
}
