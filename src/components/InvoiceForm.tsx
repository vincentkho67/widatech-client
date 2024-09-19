'use client';
import React from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { InvoiceFormData } from '@/types/invoice';

import CustomerInfoSection from '@/components/InvoiceForm/CustomerInfoSection';

import { useInitialSuggestions } from '@/hooks/useInitialSuggestion';
import { useInvoiceSubmission } from '@/hooks/useInvoiceSubmission';
import ProductsSection from './InvoiceForm/ProductsSection';

const InvoiceForm: React.FC = () => {
  const { register, control, handleSubmit, setValue, formState: { errors }, reset } = useForm<InvoiceFormData>({
    defaultValues: {
      products: [{ product_id: 0, quantity: 1, name: '' }],
      payment_type: 'CREDIT'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products"
  });

  const { initialSuggestions } = useInitialSuggestions();
  const { submitInvoice } = useInvoiceSubmission();

  const onSubmit: SubmitHandler<InvoiceFormData> = async (data) => {
    try {
      await submitInvoice(data);
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
            <CustomerInfoSection register={register} errors={errors} setValue={setValue} />
            <ProductsSection 
              fields={fields}
              register={register}
              errors={errors}
              setValue={setValue}
              append={append}
              remove={remove}
              initialSuggestions={initialSuggestions}
            />
            <Button type="submit" className="w-full">Submit Invoice</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceForm;