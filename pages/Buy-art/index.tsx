import { Product } from '@/types/WooCommerceTypes';
import React, { useEffect, useState } from 'react';

import BuyArt from '@/components/BuyArtGallery';
import Cart from '@/components/Cart';
import { useAppDispatch } from '@/lib/hooks';

import Link from 'next/link';
import FilterProducts from '@/components/FilterProducts';


interface ProductProps {
  products: Product[];
}

interface modalProps {
  modalOpen: boolean;

  setModalOpen: (open: boolean) => void;

  cartItems: any[];

}



export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedSize, setSelectedSizes] = useState<string | null>(null);

  const dispatch = useAppDispatch();



  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/get-products');
        const products: Product[] = await response.json();
        setProducts(products);

        // Ensure stock data matches the StockItem[] structure
        const stockData = products.map(product => ({
          id: product.id,
          stock: product.stock_quantity ?? 0, // Default to 0 if stock_quantity is null or undefined
        }));

        console.log("Kategorier", products.flatMap((product) => product.categories[0]))
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, [dispatch]);


  let filteredProducts = selectedFilter
    ? products.filter(product =>
      product.categories.some(category => category.name === selectedFilter)
    )
    : products;

  if (selectedSize) {
    filteredProducts = filteredProducts.filter(product => {
      const width = product.dimensions?.width || "Unknown";
      const height = product.dimensions?.height || "Unknown";
      const size = `${width}cm x ${height}cm`;
      return size === selectedSize;
    });
  }


  if (selectedFilter && selectedSize) {
    filteredProducts = filteredProducts.filter(product => {
      const width = product.dimensions?.width || "Unknown";
      const height = product.dimensions?.height || "Unknown";
      const size = `${width}cm x ${height}cm`;
      return product.categories.some(category => category.name === selectedFilter) && size === selectedSize;
    });
  }

  return (
    <main className="min-h-screen p-2 lg:p-10">
      <div className='mt-20 '>
        <h1 className="px-3 lg:px-5 2xl:px-10 text-6xl lg:text-9xl 2xl:text-[8.1vw] tracking-wide  pt-5 ">Carpets </h1>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-4 mx-auto  mt-10">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="w-full h-[300px] sm:h-[400px] bg-gray-200 rounded-md flex justify-center items-center animate-pulse">
              <div className="w-full h-[300px] sm:h-[350px] bg-zinc-300 animate-pulse rounded-lg"></div>
            </div>
          ))}

        </div>
      ) : (
        <>

          <span className='font-mono text-lg'>({filteredProducts.length})</span>
          <FilterProducts
            products={products}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            selectedSize={selectedSize}
            setSelectedSizes={setSelectedSizes} />
          <Cart modalOpen={false} setModalOpen={function (open: boolean): void {

          }} />
          <BuyArt products={filteredProducts} />

        </>
      )}


      <div className='w-fit p-1 mt-32 bg-zinc-500 text-white'>
        <Link href="/TermsofService" className=''>Terms of service</Link>
      </div>
    </main>
  );
}