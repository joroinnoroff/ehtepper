import fetch from "node-fetch";

const CUSTOMER_NUMBER = process.env.BRING_CUSTOMER_NUMBER!;
const PRODUCT_ID = "5600"; // Standard produkt-ID for Bring
const BRING_API_UID = process.env.BRING_API_UID!;
const BRING_API_KEY = process.env.BRING_API_KEY!;
const CLIENT_URL = process.env.NEXT_PUBLIC_SITE_URL!;

// Definer Bring API-responsen
interface BringApiResponse {
  consignments?: {
    products?: {
      id: string;
      productionCode?: string;
      name?: string;
      expectedDelivery?: {
        price?: {
          amount: number;
        };
        formattedExpectedDeliveryDate?: string;
      };
    }[];
  }[];
}

export async function getBringShippingRate(postalCode: string) {
  const payload = {
    consignments: [
      {
        fromCountryCode: "NO",
        fromPostalCode: "0010",
        toCountryCode: "NO",
        toPostalCode: postalCode,
        packages: [{ grossWeight: 1000, lengthInCm: 30, widthInCm: 20, heightInCm: 10 }],
        products: [{ customerNumber: CUSTOMER_NUMBER, id: PRODUCT_ID }],
        withPrice: true,
        withExpectedDelivery: true,
      },
    ],
    language: "NO",
  };

  console.log("📦 Sender forespørsel til Bring:", JSON.stringify(payload, null, 2));

  const response = await fetch("https://api.bring.com/shippingguide/api/v2/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-MyBring-API-Uid": BRING_API_UID,
      "X-MyBring-API-Key": BRING_API_KEY!,
      "X-MyBring-Client-URL": CLIENT_URL,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.error(`🚨 Bring API feil: ${await response.text()}`);
    return [];
  }

  const data: BringApiResponse = await response.json() as BringApiResponse;
  console.log("📦 Bring API Response:", JSON.stringify(data, null, 2));

  return data?.consignments?.[0]?.products?.map((product) => ({
    id: "postenservicepakke1",
    name: product.name || product.productionCode || "Standard fraktvalg",
    price: product.expectedDelivery?.price?.amount
      ? Math.round(product.expectedDelivery.price.amount * 100)
      : 0,
    description: `Estimert leveringstid: ${product.expectedDelivery?.formattedExpectedDeliveryDate || "Ikke tilgjengelig"
      }`,
  })) || [];
}
