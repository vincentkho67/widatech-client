import React, { useState, useCallback } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { InvoiceFormData } from '@/types/invoice';
import { Product } from '@/types/product';
import { useProductSearch } from '@/hooks/useProductSearch';


interface ProductSearchInputProps {
  index: number;
  register: UseFormRegister<InvoiceFormData>;
  setValue: UseFormSetValue<InvoiceFormData>;
  initialSuggestions: Product[];
}

const ProductSearchInput: React.FC<ProductSearchInputProps> = ({ index, register, setValue, initialSuggestions }) => {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const { searchProducts } = useProductSearch();

  const handleProductSearch = useCallback(async (query: string) => {
    setValue(`products.${index}.name`, query);
    if (query.length > 2) {
      const results = await searchProducts(query);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [index, setValue, searchProducts]);

  const selectProduct = (product: Product) => {
    setValue(`products.${index}.product_id`, product.id);
    setValue(`products.${index}.name`, product.name);
    setValue(`products.${index}.price`, product.price);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search for a product"
        {...register(`products.${index}.name` as const, { required: 'Product name is required' })}
        onChange={(e) => handleProductSearch(e.target.value)}
        onFocus={() => {
          if (!suggestions.length) {
            setSuggestions(initialSuggestions);
          }
        }}
        onBlur={() => {
          setTimeout(() => setSuggestions([]), 200);
        }}
      />
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-auto">
          {suggestions.map((product) => (
            <div
              key={product.id}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => selectProduct(product)}
            >
              <img src={product.picture_url} alt={product.name} className="w-10 h-10 object-cover mr-2" />
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-600">Stock: {product.stock} | Price: ${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearchInput;