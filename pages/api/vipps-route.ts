import { NextApiRequest, NextApiResponse } from "next";

async function createVippsSession(lineItems: any[], shippingAddress?: any, wcOrderId?: string) {
  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    throw new Error("Ugyldige linjeelementer i handlekurv.");
  }

  const cartTotal = lineItems.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  if (isNaN(cartTotal) || cartTotal <= 0) {
    throw new Error(`Ugyldig handlekurv total: ${cartTotal}`);
  }

  const orderId = `VIPPS-${Date.now().toString().slice(-10)}`;
  const vippsReference = orderId.split('-')[1];




  const vippsPayload = {
    type: "PAYMENT",
    transaction: {
      amount: {
        value: Math.round(cartTotal * 100),
        currency: "NOK",
      },
      reference: orderId,
      paymentDescription: "Handlekurv Monica Winthers total",
      metadata: {
        lineItems: JSON.stringify(lineItems),
      },
    },
    logistics: {

      dynamicOptionsCallback: `${process.env.NEXT_PUBLIC_SITE_URL}/api/bring-route`,


      integrations: {
        bring: {
          publicToken: process.env.BRING_API_UID,
          apiKey: process.env.BRING_API_KEY,
          origin: {
            name: shippingAddress?.firstName + shippingAddress?.lastName || "",
            email: shippingAddress?.email || "",
            phoneNumber: shippingAddress?.phone || "",
            address: {
              streetAddress: shippingAddress?.address_1 || "",
              postalCode: shippingAddress?.postcode || "",
              city: shippingAddress?.city || "",
              country: shippingAddress?.country || "",
            },
          },
        },
      },
    },
    prefillCustomer: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      streetAddress: shippingAddress?.address_1 || "",
      city: shippingAddress?.city || "",
      postalCode: shippingAddress?.postcode || "",
      country: shippingAddress?.country || "",
    },
    merchantInfo: {
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/vipps-callback`,
      returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/success?reference=${vippsReference}&wcOrderId=${wcOrderId}`,

      termsAndConditionsUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/TermsofService`,
      callbackAuthorizationToken: process.env.VIPPS_CALLBACK_AUTHORIZATION || "1234556324412341256",
    },

    configuration: {
      customerInteraction: "CUSTOMER_PRESENT",
      elements: "Full",
      countries: { supported: ["NO", "SE", "DK"] },
    },
  };

  console.log("🔄 dynamicOptionsCallback:", `https://monicaw.vercel.app/api/bring-route`);
  console.log("🛒 Oppretter Vipps-sesjon med payload:", JSON.stringify(vippsPayload, null, 2));

  const response = await fetch("https://apitest.vipps.no/checkout/v3/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "client_id": process.env.VIPPS_CLIENT_ID!,
      "client_secret": process.env.VIPPS_CLIENT_SECRET!,
      "Ocp-Apim-Subscription-Key": process.env.VIPPS_SUBSCRIPTION_KEY!,
      "Merchant-Serial-Number": process.env.VIPPS_MSN!,
      "Referer": process.env.NEXT_PUBLIC_SITE_URL!,
      "Vipps-System-Name": "Next.js Store",
      "Vipps-System-Version": "3.1.2",
      "Vipps-System-Plugin-Name": "Next.js Store",
      "Vipps-System-Plugin-Version": "4.5.6",
    },
    body: JSON.stringify(vippsPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("🚨 Vipps feil:", errorText);
    throw new Error(`Vipps session creation failed: ${errorText}`);
  }

  return response.json();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { wcOrderId, lineItems, shipping } = req.body;

      if (!Array.isArray(lineItems) || lineItems.length === 0) {
        return res.status(400).json({ message: "Ugyldige input-data" });
      }

      const vippsSession = await createVippsSession(lineItems, shipping, wcOrderId);

      return res.status(200).json({
        checkoutFrontendUrl: vippsSession.checkoutFrontendUrl,
        token: vippsSession.token,
        reference: vippsSession.reference,
      });
    }

    res.setHeader("Allow", ["POST"]);
    return res.status(405).end("Metode ikke tillatt");
  } catch (error: any) {
    console.error("🚨 Vipps API-feil:", error);
    return res.status(500).json({ message: error.message || "Intern serverfeil" });
  }
}