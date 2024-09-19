import { useState } from 'react';
import { InvoiceFormData } from '@/types/invoice';

export const useInvoiceSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitInvoice = async (data: InvoiceFormData) => {
    setIsSubmitting(true);
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
          details: data.products
            .filter(p => p.product_id !== 0)
            .map(p => ({
                quantity: Number(p.quantity),
                product_id: p.product_id
            }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create invoice');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitInvoice, isSubmitting };
};