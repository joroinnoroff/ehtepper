import { Product } from '@/types/WooCommerceTypes';
import { ArrowUpDown, ChartColumn, Option, Palette } from 'lucide-react';
import React, { useState } from 'react';

interface FilterProps {
  products: Product[];
  selectedFilter: string | null;
  selectedSize: string | null;
  setSelectedFilter: (category: string | null) => void;
  setSelectedSizes: (size: string | null) => void;
}

const FilterProducts: React.FC<FilterProps> = ({ products, selectedFilter, selectedSize, setSelectedFilter, setSelectedSizes }) => {
  const [showSizeOptions, setShowSizeOptions] = useState(false);
  const [showCategory, setShowCategory] = useState(false);

  // Extract unique categories
  const categories = [...new Set(products
    .flatMap((product) => product.categories
      .filter((category) => category.name !== 'Uncategorized')
      .map((category) => category.name)))];

  // Extract unique dimensions (width x height)
  const sizes = [...new Set(products
    .map((product) => {
      const width = product.dimensions?.width || "Unknown";
      const height = product.dimensions?.height || "Unknown";
      return `${width}cm x ${height}cm`;
    })
    .filter(size => size !== "Unknowncm x Unknowncm"))];

  return (
    <div className='lg:w-4/8 h-20 my-10'>

      <div className='flex items-center gap-4 lg:gap-10'>
        {products.length === 0 ? (
          <>loading...</>
        ) : (
          <>

            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 border rounded-md hover:underline transition-all text-lg tracking-widest"
                onClick={() => setShowCategory(!showCategory)}
              >
                <Palette /> {selectedFilter || "All categories"}
              </button>

              {showCategory && (
                <div className="absolute top-12 left-0 bg-white border shadow-md rounded-md p-2 z-10 text-2xl">
                  <span
                    onClick={() => { setSelectedFilter(null); setSelectedSizes(null); setShowCategory(false); }}
                    className="block cursor-pointer p-1 hover:bg-gray-100 text-lg"
                  >
                    All categories
                  </span>
                  {categories.map((categoryName, index) => (
                    <span
                      key={index}
                      className={`border flex items-center justify-around cursor-pointer p-1 hover:bg-gray-100   ${selectedFilter === categoryName ? 'text-purple-600' : ''
                        }`}
                      onClick={() => { setSelectedFilter(categoryName || null); setSelectedSizes(null); setShowCategory(false); }}
                    >
                      {categoryName}
                    </span>
                  ))}
                </div>
              )}
            </div>


            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 border rounded-md hover:underline transition-all tracking-widest text-lg"
                onClick={() => setShowSizeOptions(!showSizeOptions)}
              >
                <ArrowUpDown /> {selectedSize || "All sizes"}
              </button>

              {showSizeOptions && (
                <div className="absolute top-12 left-0 bg-white border shadow-md rounded-md p-2 z-10 lg:text-2xl">
                  <span
                    onClick={() => { setSelectedSizes(null); setShowSizeOptions(false); setSelectedFilter(null); setShowCategory(false); }}
                    className="block cursor-pointer p-1 hover:bg-gray-100"
                  >
                    All Sizes
                  </span>
                  {sizes.map((size, index) => (
                    <span
                      key={index}
                      className={`border flex items-center justify-around -  lg:w-52 cursor-pointer p-1 hover:bg-gray-100 tracking-widest ${selectedSize === size ? 'text-purple-600' : ''
                        }`}
                      onClick={() => { setSelectedSizes(size); setShowSizeOptions(false); setSelectedFilter(null); setShowCategory(false); }}
                    >
                      {size}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FilterProducts;
