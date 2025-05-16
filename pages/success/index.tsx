import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Order } from "@/types/WooCommerceTypes";
import Image from "next/image";
import Link from "next/link";

export default function SuccessPage() {
  const router = useRouter();
  const { wcOrderId } = router.query;

  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeoutMessage, setTimeoutMessage] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!wcOrderId || Array.isArray(wcOrderId)) return;

    const fetchOrder = async () => {
      setLoading(true);
      setTimeoutMessage(false);

      const attemptFetch = async (attempt: number) => {
        try {
          const timeout = setTimeout(() => {
            setTimeoutMessage(true);
          }, 10000);

          const res = await fetch(`/api/completed-orders?wcOrderId=${wcOrderId}`);
          clearTimeout(timeout);

          if (!res.ok) throw new Error("Failed to fetch order");
          const order = await res.json();
          order.line_items = order.line_items.map((item: { image: { src: any; }; }) => ({
            ...item,
            imageUrl: item.image?.src || null,
          }));
          setOrderData(order);

          setOrderData(order);
        } catch (err: any) {
          console.error(err);
          if (attempt < 2) {
            setRetryCount((prev) => prev + 1);
            setTimeoutMessage(false);
            setTimeout(() => attemptFetch(attempt + 1), 10000);
          } else {
            setError("Could not load your order. Please try again later.");
          }
        } finally {
          setLoading(false);
        }
      };

      attemptFetch(0);
    };
    console.log(orderData)
    fetchOrder();
  }, [wcOrderId]);

  return (
    <div className="min-h-screen  mx-auto font-mono">
      {loading ? (
        <>
          <div className="flex items-center justify-center mt-20">
            <p>Getting your details, hold on a minute...</p>
            {timeoutMessage && <p className="text-red-500">Request timed out. Please try again later.</p>}
            {retryCount > 0 && <p>Attempt #{retryCount} failed. Retrying...</p>}
          </div>
        </>
      ) : error ? (
        <p>{error}</p>
      ) : !orderData ? (
        <p>Order data not available.</p>
      ) : (
        <>
          <div className="flex items-center w-full flex-col p-4 mt-20">
            <h1 className="text-2xl lg:text-8xl tracking-widest font-bold mb-4 text-center">Payment Successful!</h1>
            <Image width={200} height={200} alt="" src={"/trackingglobe.png"} className="absolute right-20 top-32" />
            <div className="flex max-w-7xl w-full mt-12">
              <div className="flex flex-col w-3/4">
                <span className="text-2xl">Order number #{orderData.id}</span>
                <p className="my-4 text-4xl">
                  Thank you, {orderData.billing?.first_name} {orderData.billing?.last_name}
                </p>
                <p>Your items will be delivered in 7–14 days.</p>
                <p>A confirmation has been sent to {orderData.billing?.email}.</p>
                <h2 className="text-xl font-semibold mb-2">Your Items:</h2>
                <div className="flex flex-col w-full shadow">
                  {orderData.line_items.map((item) => (
                    <div key={item.id} className="flex items-center justify-around  h-full rounded shadow w-full p-2">
                      <Image
                        src={item.imageUrl || "/fallback-image.jpg"}
                        alt="Product image"
                        width={96}
                        height={96}
                        className="object-cover rounded"
                      />
                      <div>
                        <h2 className="font-bold">{item.name}</h2>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: {item.price} {orderData.currency?.toUpperCase()}</p>
                        <p>Total: {item.total} {orderData.currency?.toUpperCase()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/" className="p-5">
                  Back to homepage
                </Link>
              </div>
              <div className="right w-3/6 text-center">
                <h2>Tracking</h2>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
