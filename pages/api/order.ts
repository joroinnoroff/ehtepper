import type { NextApiRequest, NextApiResponse } from 'next';
import { Order } from '@/types/WooCommerceTypes';
import { createWooCommerceOrder } from '../../utils/woomerceApi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { lineItems, customerInformation, shippingOption, vippsReference } = req.body;

      if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
        return res.status(400).json({ message: "Missing or invalid lineItems" });
      }

      const emptyInfo = {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address_1: "",
        city: "",
        postcode: "",
        country: "NO",

      };

      const customer = customerInformation || emptyInfo;

      const orderData: Order = {
        payment_method: 'vipps',
        payment_method_title: 'Vipps',
        set_paid: false,
        billing: customer,
        shipping: customer,
        line_items: lineItems,
        status: 'processing',
        meta_data: [
          {
            key: 'shipping_option',
            value: shippingOption || null,
          },
          {
            key: 'vippsReference',
            value: vippsReference || null,
          },
        ],
      };

      const wooOrder = await createWooCommerceOrder(orderData);

      return res.status(200).json({
        wcOrderId: wooOrder.id,
        vippsReference: vippsReference || null,
      });
    } catch (error: any) {
      console.error('Error creating WooCommerce order:', error);
      return res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).end('Method Not Allowed');
}
