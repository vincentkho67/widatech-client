import React, { useState, useCallback, useRef, useEffect } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  const [inputValue, setInputValue] = useState('');
  const [autocompleteSuggestion, setAutocompleteSuggestion] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const { searchProducts } = useProductSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleProductSearch = useCallback(async (query: string) => {
    setInputValue(query);
    setValue(`products.${index}.name`, query);
    if (query.length > 2) {
      const results = await searchProducts(query);
      setSuggestions(results);
      
      const matchingSuggestion = results.find(product => 
        product.name.toLowerCase().startsWith(query.toLowerCase())
      );
      if (matchingSuggestion) {
        setAutocompleteSuggestion(matchingSuggestion.name);
      } else {
        setAutocompleteSuggestion('');
      }
    } else {
      setSuggestions([]);
      setAutocompleteSuggestion('');
    }
  }, [index, setValue, searchProducts]);

  const selectProduct = (product: Product) => {
    setValue(`products.${index}.product_id`, product.id);
    setValue(`products.${index}.name`, product.name);
    setValue(`products.${index}.price`, product.price);
    setInputValue(product.name);
    setSuggestions([]);
    setAutocompleteSuggestion('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && autocompleteSuggestion) {
      e.preventDefault();
      selectProduct(suggestions.find(p => p.name === autocompleteSuggestion)!);
    }
  };

  const handleCursorMove = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    setCursorPosition(input.selectionStart || 0);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.caretColor = 'black';
    }
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
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
                  setTimeout(() => {
                    setSuggestions([]);
                    setAutocompleteSuggestion('');
                  }, 200);
                }}
                onKeyDown={handleKeyDown}
                onSelect={handleCursorMove}
                value={inputValue}
                ref={inputRef}
                className="pr-4"
              />
              {autocompleteSuggestion && (
                <div 
                  className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden whitespace-pre"
                  style={{ 
                    paddingLeft: `${cursorPosition * 2}px`,
                    paddingTop: '6px',
                    paddingBottom: '8px',
                    paddingRight: '8px'
                  }}
                >
                  <span className="invisible">{inputValue.slice(0, cursorPosition)}</span>
                  <span className="text-gray-400">{autocompleteSuggestion.slice(cursorPosition)}</span>
                </div>
              )}
            </div>
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
        </TooltipTrigger>
        <TooltipContent>
          <p>Press Tab to autocomplete</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ProductSearchInput;