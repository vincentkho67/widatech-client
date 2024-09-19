import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InvoiceFormData } from '@/types/invoice';

interface CustomerInfoSectionProps {
  register: UseFormRegister<InvoiceFormData>;
  errors: FieldErrors<InvoiceFormData>;
  setValue: UseFormSetValue<InvoiceFormData>;
}

const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = ({ register, errors, setValue }) => (
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
);

export default CustomerInfoSection;