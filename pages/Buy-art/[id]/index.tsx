import { Product } from '@/types/WooCommerceTypes';
import { Loader, ViewIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import Cart from '@/components/Cart';
import toast from 'react-hot-toast';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import ModalSwiper from '@/components/ModalSwiper';

import { stripHTML } from '@/types/StripHTML';
import { updateStock } from '@/lib/features/setStock';
import { addLineItem, } from '@/lib/features/cartSlice';
import BuyArt from '@/components/BuyArtGallery';
import Tilt from '@/components/Tilt';

const ArtDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cartState = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/get-products');
        const allProducts: Product[] = await response.json();

        // Find the current product based on the ID from the URL
        const currentProduct = allProducts.find(p => p.id === Number(id));
        setProduct(currentProduct || null);

        // Filter out the current product from the list
        const filteredProducts = allProducts.filter(p => p.id !== Number(id));
        setProducts(filteredProducts);

        // Dispatch stock update to Redux if the current product is found
        if (currentProduct) {
          dispatch(updateStock({ id: currentProduct.id, qty: currentProduct.stock_quantity }));
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProducts();
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (!product) return;

    setLoading(true);
    const existingCartItem = cartState.lineItems.find(
      (lineItem) => lineItem.product_id === product.id
    );

    const currentCartQuantity = existingCartItem ? existingCartItem.quantity : 0;

    // Check if there is enough stock available
    const remainingStock = product.stock_quantity - currentCartQuantity;

    if (remainingStock <= 0) {
      toast.error("Not enough stock available.");
      setLoading(false);
      return;
    }

    const lineItem = {
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1, // Adding one at a time
      image: product.images?.[0]?.src || "",
    };

    setTimeout(() => {
      dispatch(addLineItem(lineItem));
      dispatch(updateStock({ id: product.id, qty: -1 })); // Reduce stock
      toast.success("Added to cart");
      setLoading(false);
    }, 1000); // 3 seconds delay
  };




  if (!product) {
    return <div className='flex items-center justify-center min-h-screen w-auto'><Tilt /></div>;
  }

  return (
    <AnimatePresence mode='wait' >
      <main className="min-h-screen p-2 lg:p-10">
        <Cart modalOpen={false} setModalOpen={() => { }} />
        <section className="px-2 lg:px-10 mt-10">
          <motion.div className="wrapper flex flex-col xl:flex-row xl:justify-between w-full items-center xl:items-start max-w-7xl mx-auto gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={{
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              hidden: { opacity: 0, y: 20, transition: { duration: 0.6 } },
            }}>
            <motion.div className='relative w-full h-[500px] md:h-[700px] lg:h-[800px] flex justify-center items-center overflow-hidden'>

              {/* Image */}
              {product.images?.length > 0 && (
                <Image
                  src={product.images[0].src}
                  height={800}
                  width={800}
                  alt="Product image"
                  className="object-contain max-h-full max-w-[95%] "
                />
              )}

              <div className="RulerWidth absolute top-0 left-1/2 -translate-x-1/2 flex items-center font-mono gap-2">
                <motion.div className='h-[1px] border w-24 border-black' />
                <div className="RulerTekst">{product.dimensions.width}cm</div>
                <motion.div className='h-[1px] border w-24 border-black' />
              </div>


              <div className="RulerHeight relative min-w-12  rotate-90 flex items-center font-mono gap-2">
                <div className='flex items-center gap-2 w-12 h-full'>
                  <motion.div className='h-[1px] border w-24 border-black' />
                  <div className="RulerTekst">{product.dimensions.height}cm</div>
                  <motion.div className='h-[1px] border w-24 border-black' />
                </div>
              </div>







            </motion.div>
            <div className='flex xl:hidden justify-center w-3/6 gap-5 items-center '>
              <div className="flex my-20 space-x-2">
                {product.images.map((image, index) => (
                  <Image
                    key={image.id}
                    src={image.src}

                    width={50}
                    height={50}
                    alt={`Thumbnail`}
                    className="cursor-pointer object-cover"
                    onClick={() => setIsModalOpen(true)}
                  />
                ))}
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className=" tracking-widest cursor-pointer"
              >

                <ViewIcon />
              </button>
            </div>
            <div className="flex flex-col items-start xl:w-[52%] m-auto p-2  ">
              <div className='hidden xl:flex justify-center w-3/6 gap-5 items-center '>
                <div className="flex my-20 space-x-2">
                  {product.images.map((image, index) => (
                    <Image
                      key={image.id}
                      src={image.src}

                      width={50}
                      height={50}
                      alt={`Thumbnail`}
                      className="cursor-pointer object-cover"
                      onClick={() => setIsModalOpen(true)}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className=" tracking-widest cursor-pointer"
                >

                  <ViewIcon />
                </button>
              </div>

              <h1 className="mt-5 lg:mt-0 text-7xl tracking-widest">{product.name}</h1>

              <p className="tracking-widest text-lg xl:text-xl max-w-3xl mb-10 font-mono">
                {stripHTML(product.description)}
              </p>
              <span className="tracking-widest text-4xl lg:text-4xl">{product.price} Kr</span>
              <div className="flex justify-between items-center w-full font-mono my-4">
                <button
                  className="px-4 py-3 h-16 lg:w-60 rounded-md bg-purple-900 text-white text-xl tracking-widest uppercase transition-colors hover:bg-purple-950 relative z-30 flex items-center justify-center"
                  onClick={handleAddToCart}
                >
                  {loading ? <Loader className='animate-spinner-linear-spin transition-transform' /> : <p className='text-zinc-200 hover:text-white'> Add to cart</p>}
                </button>
                <span className="tracking text-sm opacity-60 ">
                  In stock: {product.stock_quantity - (cartState.lineItems.find(item => item.product_id === product.id)?.quantity || 0)}
                </span>


              </div>



              <div className='w-full flex items-center gap-4 '>

                <div className="summary rounded-md flex  flex-col w-full p-2 items-start justify-start  text-xs">
                  <span className="mt-5  tracking-widest capitalize text-pretty text-3xl text-purple-600">Description:</span>
                  <table className="table-auto mt-2 w-full font-mono ">
                    <tbody className='w-full flex flex-col gap-0'>
                      <tr className=''>
                        <td className="pr-4 font-bold ">Width:</td>
                        <td className='font-light flex items-end justify-end'>{product.dimensions.width} cm</td>
                      </tr>
                      <tr>
                        <td className="pr-4 font-bold ">Height:</td>
                        <td className='font-light flex items-end justify-end'>{product.dimensions.height} cm</td>
                      </tr>
                      <tr>
                        <td className="pr-4 font-bold">Created:</td>
                        <td className='font-light flex items-end justify-end'>2018</td>
                      </tr>
                    </tbody>
                  </table>
                </div>


              </div>

            </div>

          </motion.div>

          {isModalOpen && (
            <ModalSwiper
              products={[product]}
              selectedProductId={product.id}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </section>
        <p className='text-center tracking-widest text-zinc-800 text-4xl mt-20'>Related items:</p>
        <BuyArt products={products} />

      </main>
    </AnimatePresence >
  );
};

export default ArtDetail;
