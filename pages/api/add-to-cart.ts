export default async function handler(req: {
  body: { productId: any; qty: any; name: string; permalink: string; };
  method: string;
  cookies: { cart: string; };
}, res: {
  setHeader: (arg0: string, arg1: string | string[]) => void;
  status: (arg0: number) => {
    json: (arg0: { message: string; }) => void;
    end: (arg0: string) => void;
  };
}) {
  const { productId, qty, name, permalink } = req.body;

  if (req.method === 'POST') {
    // Get the cart from the cookies
    const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

    // Check if the product is already in the cart
    const existingProduct = cart.find((item: { productId: any; }) => item.productId === productId);

    if (existingProduct) {
      // Update the quantity
      existingProduct.qty += qty;
    } else {
      // Add the product to the cart
      cart.push({ productId, qty, name, permalink }); // Include the name
    }

    // Save the cart to the cookies
    res.setHeader('Set-Cookie', `cart=${JSON.stringify(cart)}; Path=/`);

    res.status(200).json({ message: 'Added to cart' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
