

export interface WooShippingData {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
  email: string;
}

export interface WooBillingData {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
  email: string;
  phone?: string;
}

export interface WooOrderPayload {
  payment_method: string;
  status: string;
  needs_payment: boolean;
  needs_processing: boolean;
  billing: WooBillingData;
  shipping: WooShippingData;
  line_items: Array<{
    product_id: number;
    quantity: number;
  }>;
}
