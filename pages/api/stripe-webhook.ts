import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';

export const config = { api: { bodyParser: false } };

function readBody(stream: Readable) {
  const chunks: Uint8Array[] = [];
  return new Promise<Buffer>((resolve, reject) => {
    stream.on('data', (chunk) => {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    });
    stream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    stream.on('error', reject);
  });
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-12-18.acacia' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  try {
    const rawBody = await readBody(req);
    const signature = req.headers['stripe-signature'] || '';
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.client_reference_id;
      const r = await fetch(`${process.env.WOOCOMMERCE_API_URL}orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
            ).toString('base64'),
        },
        body: JSON.stringify({ status: 'processing' }),
      });
      if (!r.ok) {
        const msg = await r.text();
        return res.status(500).json({ error: msg });
      }
    }
    return res.json({ received: true });
  } catch (e: any) {
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }
}
