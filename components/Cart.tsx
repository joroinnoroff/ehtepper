import { AnimatePresence, motion, Variants } from "framer-motion";
import { ShoppingCart, X, MinusIcon, PlusIcon, Trash, ReceiptText } from "lucide-react";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { perspective } from "../anim";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "../lib/hooks";
import { decrementLineItemQuantity, addLineItem, removeLineItem } from "../lib/features/cartSlice";
import Link from "next/link";

const Cart: React.FC<{ modalOpen: boolean; setModalOpen: (open: boolean) => void }> = ({ modalOpen, setModalOpen }) => {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state) => state.cart);

  const [openCart, setOpenCart] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (modalOpen !== openCart) {
      setOpenCart(modalOpen);
    }
  }, [modalOpen]);

  useEffect(() => {
    if (openCart !== modalOpen) {
      setModalOpen(openCart);
    }
  }, [openCart]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleResize();
    mediaQuery.addListener(handleResize);
    return () => {
      mediaQuery.removeListener(handleResize);
    };
  }, []);

  const handleUpdateQuantity = (productId: number, increment: boolean) => {
    const item = cartState.lineItems.find((lineItem) => lineItem.product_id === productId);
    if (!item) return;

    if (!increment && item.quantity === 1) {
      handleRemoveItem(productId);
      return;
    }

    dispatch(
      increment
        ? addLineItem({ ...item, quantity: 1 })
        : decrementLineItemQuantity({ product_id: productId, quantity: 1 })
    );
    toast.success("Quantity updated.");
  };

  const handleRemoveItem = (productId: number) => {
    const item = cartState.lineItems.find((lineItem) => lineItem.product_id === productId);
    if (item) {
      dispatch(removeLineItem({ product_id: productId, quantity: item.quantity }));
      toast.success("Removed item from Cart.");
    }
  };

  const cartIconVariants: Variants = {
    open: {
      opacity: 0,
    },
    closed: {
      opacity: 1,
    },
  };

  const overlayVariants: Variants = {
    open: {
      opacity: 0.5,
    },
    closed: {
      opacity: 0,
    },
  };

  const modalVariants: Variants = {
    open: {
      width: isMobile ? "100%" : "60%",
      height: "100vh",
      top: "0px",
      right: "0px",
      zIndex: 100,
      overflowY: "scroll",
      transition: { duration: 0.75, type: "tween", ease: [0.76, 0, 0.24, 1] },
    },
    closed: {
      width: "0%",
      height: "100vh",
      top: "0px",
      right: "0px",
      overflowY: "scroll",
      transition: { duration: 0.75, delay: 0.35, type: "tween", ease: [0.76, 0, 0.24, 1] },
    },
  };

  const total = cartState.lineItems.reduce((acc, item) => {
    const price = parseFloat(item?.price || "0");
    return acc + price * item.quantity;
  }, 0);

  const cartTotalQty = () => {
    return cartState.lineItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <div className="absolute z-50 top-40 right-20 h-full ">
      <Toaster
        position="top-left"
        toastOptions={{
          style: {
            background: "#c117c7",
            color: "#fff",
          },
          iconTheme: {
            primary: "#ffffff", // White checkmark color
            secondary: "#c117c7", // Background color of the checkmark icon
          },
        }}
      />
      <AnimatePresence>
        {!openCart ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cartIconVariants}
            key="cartIcon"
            onClick={() => setOpenCart(!openCart)}
            className="absolute top-5 cursor-pointer"
          >
            <ShoppingCart strokeWidth={1.25} />
            <span className="absolute -top-4 -right-2 w-5 h-5 bg-gray-900 rounded-full text-white text-xs flex items-center justify-center">
              {cartTotalQty()}
            </span>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              key="overlay"
              className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50"
              onClick={() => setOpenCart(false)}
            />
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={modalVariants}
              key="cartModal"
              className="w-52 fixed right-20 bg-[#FDF9EF] p-5"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => setOpenCart(false)}
                className="absolute top-10 left-5 cursor-pointer"
              >
                <X strokeWidth={1.25} size={25} />
              </motion.div>
              <motion.h1
                variants={perspective}
                initial="initial"
                animate="enter"
                exit="exit"
                className="text-3xl md:text-4xl my-12 tracking-widest"
              >
                Your Cart
              </motion.h1>
              {cartState.lineItems.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-gray-500 tracking-widest">Your cart is empty</motion.p>
              ) : (
                <>
                  <motion.ul className="mb-4 "
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p>Total items<span className=""> {cartTotalQty()}</span> </p>
                    {cartState.lineItems.map((item) => (
                      <li
                        key={item.product_id}
                        className={` ${cartState.lineItems.indexOf(item) === cartState.lineItems.length - 1 ? "" : "border-b"
                          } py-2 flex justify-evenly items-center w-full`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <div className="flex flex-col">
                            <Image
                              src={item?.image || "/fallback-image.jpg"}
                              alt="cartimg"
                              height={120}
                              width={90}
                              className="rounded-md"
                            />

                          </div>
                          <div className="flex items-center flex-col w-80">

                            <span className="text-sm text-gray-500 ml-[4rem] text-center  flex">
                              {item.quantity} x {item.price} kr
                            </span>
                          </div>
                          <div className="col-span-1 flex items-center justify-center">
                            <button
                              title="Decrease"
                              onClick={() => handleUpdateQuantity(item.product_id, false)}
                            >
                              <MinusIcon strokeWidth={1.25} />
                            </button>
                            <span className="mx-2">{item.quantity}</span>
                            <button
                              title="Increase"
                              onClick={() => handleUpdateQuantity(item.product_id, true)}
                            >
                              <PlusIcon strokeWidth={1.25} />
                            </button>
                          </div>
                          <div className="col-span-1 text-right text-xs">
                            <button
                              title="Remove"
                              onClick={() => handleRemoveItem(item.product_id)}
                            >
                              <Trash strokeWidth={1.25} />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </motion.ul>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className=" ">
                    <div>
                      <span className="font-semibold tracking-wide text-zinc-500">Total:</span>
                      {total} kr
                    </div>
                    <p className="pl-2   my-5">Free shipping</p>
                    <Link href={"/Checkout"} className="border px-3 py-3 rounded-md w-52 text-2xl tracking-wide hover:bg-pink-50 transition-all">To checkout</Link>
                  </motion.div>
                </>
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } }}
                exit={{ opacity: 0 }}
                className=' flex gap-20 items-center my-2 h-auto lg:h-fit bottom-0 z-50 w-80 mx-auto'>
                <div className="paymentoptions flex items-center gap-2">
                  <Image src={"/visa.png"} width={50} height={50} alt="visa" />
                  <Image src={"/mastercard.png"} width={50} height={50} alt="visa" />
                  <Image src={"/vipps.png"} width={50} height={50} alt="visa" />
                </div>
                <Link href={"/TermsofService"} className="terms text-xs hover:text-zinc-700 transition-all opacity-75 flex gap-2 items-center  ">
                  <ReceiptText /> Salgsvilkår
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
