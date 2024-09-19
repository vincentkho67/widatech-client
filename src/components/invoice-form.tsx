'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from '@/hooks/use-toast';
import debounce from 'lodash/debounce';
import { Product } from '@/types/product';
import { ProductApiResponse } from '@/types/api-response/products/response';
import { InvoiceFormData } from '@/types/invoice';

const InvoiceForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});
  const [suggestions, setSuggestions] = useState<{ [key: number]: Product[] }>({});
  const [initialSuggestions, setInitialSuggestions] = useState<Product[]>([]);

  const { register, control, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<InvoiceFormData>({
    defaultValues: {
      products: [{ product_id: 0, quantity: 1, name: '' }],
      payment_type: 'CREDIT'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products"
  });

  useEffect(() => {
    fetchInitialSuggestions();
  }, []);

  const fetchInitialSuggestions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products');
      const data = await response.json();
      setInitialSuggestions(data.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching initial suggestions:', error);
    }
  };

  const fetchProducts = async (query: string, index: number) => {
    setIsLoading(prev => ({ ...prev, [index]: true }));
    try {
      const response = await fetch(`http://localhost:8080/api/products?q=${query}`);
      const data: ProductApiResponse = await response.json();
      setSuggestions(prev => ({ ...prev, [index]: data.data }));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch products. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [index]: false }));
    }
  };

  const debouncedFetchProducts = useCallback(
    debounce((query: string, index: number) => fetchProducts(query, index), 300),
    []
  );

  const handleProductSearch = (query: string, index: number) => {
    setValue(`products.${index}.name`, query);
    if (query.length > 2) {
      debouncedFetchProducts(query, index);
    } else {
      setSuggestions(prev => ({ ...prev, [index]: [] }));
    }
  };

  const selectProduct = (product: Product, index: number) => {
    setValue(`products.${index}.product_id`, product.id);
    setValue(`products.${index}.name`, product.name);
    setValue(`products.${index}.price`, product.price);
    setSuggestions(prev => ({ ...prev, [index]: [] }));
  };

  const onSubmit: SubmitHandler<InvoiceFormData> = async (data) => {
    try {
      const response = await fetch('http://localhost:8080/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: data.customer_name,
          salesperson: data.salesperson_name,
          payment_type: data.payment_type,
          notes: data.notes,
          details: data.products.filter(p => p.product_id !== 0).map(p => ({
            quantity: p.quantity,
            product_id: p.product_id
          }))
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Invoice created successfully!',
        });

        reset({
          customer_name: '',
          salesperson_name: '',
          payment_type: 'CREDIT',
          date: '',
          notes: '',
          products: [{ product_id: 0, quantity: 1, name: '' }]
        });
        
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create invoice');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create invoice. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer_name">Customer Name</Label>
                <Input
                  type="text"
                  id="customer_name"
                  {...register('customer_name', { required: 'Customer name is required' })}
                />
                {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name.message}</p>}
              </div>

              <div>
                <Label htmlFor="salesperson_name">Salesperson</Label>
                <Input
                  type="text"
                  id="salesperson_name"
                  {...register('salesperson_name', { required: 'Salesperson name is required' })}
                />
                {errors.salesperson_name && <p className="text-red-500 text-sm mt-1">{errors.salesperson_name.message}</p>}
              </div>

              <div>
                <Label htmlFor="payment_type">Payment Type</Label>
                <Select onValueChange={(value) => setValue('payment_type', value as 'CASH' | 'CREDIT' | 'NOTCASHORCREDIT')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Credit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="CREDIT">Credit</SelectItem>
                    <SelectItem value="NOTCASHORCREDIT">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.payment_type && <p className="text-red-500 text-sm mt-1">{errors.payment_type.message}</p>}
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  id="date"
                  {...register('date', { required: 'Date is required' })}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Products</h3>
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search for a product"
                        {...register(`products.${index}.name` as const, { required: 'Product name is required' })}
                        onChange={(e) => handleProductSearch(e.target.value, index)}
                        onFocus={() => {
                          if (!field.name && !suggestions[index]) {
                            setSuggestions(prev => ({ ...prev, [index]: initialSuggestions }));
                          }
                        }}
                        onBlur={() => {
                          setTimeout(() => setSuggestions(prev => ({ ...prev, [index]: [] })), 200);
                        }}
                      />
                      {suggestions[index] && suggestions[index].length > 0 && (
                        <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-auto">
                          {suggestions[index].map((product) => (
                            <div
                              key={product.id}
                              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                              onClick={() => selectProduct(product, index)}
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

                    <Input
                      type="number"
                      placeholder="Quantity"
                      {...register(`products.${index}.quantity` as const, {
                        required: 'Quantity is required',
                        min: { value: 1, message: 'Quantity must be at least 1' }
                      })}
                    />
                    {errors.products?.[index]?.quantity && (
                      <p className="text-red-500 text-sm">{errors.products[index].quantity?.message}</p>
                    )}

                    {field.name && field.price && (
                      <p className="text-sm">Selected: {field.name} - Price: ${field.price}</p>
                    )}

                    <Button type="button" onClick={() => remove(index)} variant="destructive" size="sm">
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              ))}

              <Button type="button" onClick={() => append({ product_id: 0, quantity: 1, name: '' })} variant="outline">
                Add Product
              </Button>
            </div>

            <Button type="submit" className="w-full">Submit Invoice</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceForm;