import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-12-18.acacia',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({ error: 'Missing session_id' });
    }

    // Retrieve the session from Stripe, expanding the line items
    const session = await stripe.checkout.sessions.retrieve(session_id as string, {
      expand: ['line_items.data.price.product'],
    });

    // session.line_items is an object like: { data: [ ... ] }
    const lineItems = session.line_items?.data.map((lineItem) => {
      // The product is stored on lineItem.price.product (after expand)
      const product = lineItem.price?.product as Stripe.Product;
      return {
        id: lineItem.id,
        name: product.name,
        quantity: lineItem.quantity,
        // If you stored prices in "unit_amount", it's the price in cents
        price: (lineItem.price?.unit_amount ?? 0) / 100,
        image: product.images?.[0] || null,
      };
    }) || [];

    // Send the items back
    return res.status(200).json(lineItems);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
