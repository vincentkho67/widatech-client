import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFieldArrayAppend, UseFieldArrayRemove } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InvoiceFormData } from '@/types/invoice';
import { Product } from '@/types/product';

import { Input } from '../ui/input';
import ProductSearchInput from './ProductSearchInput';

interface ProductsSectionProps {
  fields: Record<"id", string>[];
  register: UseFormRegister<InvoiceFormData>;
  errors: FieldErrors<InvoiceFormData>;
  setValue: UseFormSetValue<InvoiceFormData>;
  append: UseFieldArrayAppend<InvoiceFormData, "products">;
  remove: UseFieldArrayRemove;
  initialSuggestions: Product[];
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ fields, register, errors, setValue, append, remove, initialSuggestions }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Products</h3>
    {fields.map((field, index) => (
      <Card key={field.id}>
        <CardContent className="pt-6 space-y-4">
          <ProductSearchInput
            index={index}
            register={register}
            setValue={setValue}
            initialSuggestions={initialSuggestions}
          />
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
);

export default ProductsSection;