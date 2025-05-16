import fetch from "node-fetch";


interface BringApiResponse {
  consignments?: {
    uniqueId: string;
    products?: {
      uniqueId: string;
      id: string;
      productionCode?: string;
      name?: string;
      price?: {
        listPrice?: {
          priceWithoutAdditionalServices?: {
            amountWithVAT: string;
          };
        };
      };
      guiInformation?: {
        displayName?: string;
        descriptionText?: string;
        logoUrl?: string;
      };
      expectedDelivery?: {
        formattedExpectedDeliveryDate?: string;
      };

    }[],


  }[],

  uniqueId: string;
}

export interface BringResponse {
  expectedDelivery: any;
  guiInformation: any;
  displayName: string;
  logoUrl: string;
  formattedExpectedDeliveryDate: string;
  id: string;
  name: string;
  price: number;
  description: string;
  uniqueId: string;
}


export async function getBringShippingRate(
  postalCode: string,
  weight: number,
  length: number,
  width: number,
  height: number
): Promise<BringResponse[]> {
  const url = "https://api.bring.com/shippingguide/api/v2/products";

  const payload = {
    consignments: [
      {
        fromCountryCode: "NO",
        fromPostalCode: "3924",
        toCountryCode: "NO",
        toPostalCode: postalCode,
        packages: [{ grossWeight: weight, lengthInCm: length, widthInCm: width, heightInCm: height }],
        products: [{ customerNumber: process.env.BRING_CUSTOMER_NUMBER, id: "5600" }],
        withPrice: true,
        withExpectedDelivery: true,
      },
    ],
    language: "NO",
  };

  console.log("🔍 Bring API Request Payload:", JSON.stringify(payload, null, 2));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-Mybring-API-Uid": process.env.BRING_API_UID!,
      "X-Mybring-API-Key": process.env.BRING_API_KEY!,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Bring API Error:", errorText);
    throw new Error("Could not fetch shipping rates");
  }

  const data: BringApiResponse = await response.json() as any;
  console.log("📦 Bring API Response:", JSON.stringify(data, null, 2));

  if (!data.consignments?.length || !data.consignments[0].products?.length) {
    console.warn("⚠️ Ingen fraktalternativer funnet!");
    return [];
  }

  const firstConsignment = data.consignments[0];



  return (firstConsignment.products ?? []).map((product) => {
    const priceAmount = product.price?.listPrice?.priceWithoutAdditionalServices?.amountWithVAT;
    const formattedPrice = priceAmount ? Math.round(parseFloat(priceAmount) * 100) : 1000;

    return {
      id: `bringservicepakke-${firstConsignment.uniqueId}`, // Bruker firstConsignment.uniqueId her
      name: product.guiInformation?.displayName || "Standard fraktvalg",
      displayName: product.guiInformation?.displayName || "Standard fraktvalg",
      price: formattedPrice,
      description: product.guiInformation?.descriptionText || "Estimert leveringstid: Ikke tilgjengelig",
      formattedExpectedDeliveryDate: product.expectedDelivery?.formattedExpectedDeliveryDate || "",
      expectedDelivery: product.expectedDelivery || null,
      guiInformation: product.guiInformation || null,
      logoUrl: product.guiInformation?.logoUrl || "https://www.posten.no/etc.clientlibs/posten/clientlibs/clientlib-site/resources/logo.svg",
      uniqueId: firstConsignment.uniqueId, // Husk å inkludere uniqueId fra consignment
    };
  });
}