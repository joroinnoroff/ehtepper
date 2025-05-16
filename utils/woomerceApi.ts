import { Order } from "@/types/WooCommerceTypes";

const consumerKey = process.env.WOOCOMMERCE_API_KEY!;
const consumerSecret = process.env.WOOCOMMERCE_API_SECRET!;
const WORDPRESS_URL = process.env.WORDPRESS_URL!;
const apiUrl = "https://www.bildeholder.art/wp-json/wc/v3";

const getAuthHeader = () => {
  if (!consumerKey || !consumerSecret) {
    throw new Error("Missing WooCommerce API credentials");
  }
  const credentials = `${consumerKey}:${consumerSecret}`;
  const base64Credentials = Buffer.from(credentials).toString("base64");
  return `Basic ${base64Credentials}`;
};

export async function fetchWooCommerceProducts() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 14000); // Avbryt etter 14 sekunder

  try {
    const response = await fetch(`${apiUrl}/products`, {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      signal: controller.signal, // Koble `AbortController` til fetch
    });

    clearTimeout(timeout); // Fjern timeout hvis responsen kommer innen fristen

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Error: Fetch request timed out");
      throw new Error("Request timed out");
    }
    console.error("Error fetching WooCommerce products:", error);
    throw new Error("Failed to fetch WooCommerce products");
  }
}


export async function createWooCommerceOrder(orderData: Order) {
  try {
    const response = await fetch(`${apiUrl}/orders`, {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },

      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ WooCommerce API-feil:", {
        status: response.status,
        statusText: response.statusText,
        body: data,
      });
      throw new Error("Failed to create WooCommerce order");
    }

    return data;
  } catch (error) {
    console.error("❌ createWooCommerceOrder error:", error);
    throw error;
  }
}


export async function retrieveProductById(productId: string) {
  try {
    const response = await fetch(`${apiUrl}/products/${productId}`, {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error retrieving product by ID:", error);
    throw new Error("Failed to retrieve product by ID");
  }
}

export const updateWooCommerceOrder = async (orderId: string, data: any) => {
  try {
    const response = await fetch(`${apiUrl}/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("🚨 WooCommerce update response:", errorText);
      throw new Error(`Failed to update order: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("⚠️ WooCommerce update error:", error.message || error);
    throw new Error("Kunne ikke oppdatere WooCommerce-ordre");
  }
};


export async function fetchWooCommerceOrders() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 14000); // Avbryt etter 14 sekunder

  try {
    const response = await fetch(`${apiUrl}/orders`, {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      signal: controller.signal, // Koble `AbortController` til fetch
    });

    clearTimeout(timeout); // Fjern timeout hvis responsen kommer innen fristen

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Error: Fetch request timed out");
      throw new Error("Request timed out");
    }
    console.error("Error fetching WooCommerce orders:", error);
    throw new Error("Failed to fetch WooCommerce orders");
  }
}