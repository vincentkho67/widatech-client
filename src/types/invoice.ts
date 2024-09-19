export interface InvoiceFormData {
    date: string;
    customer_name: string;
    salesperson_name: string;
    payment_type: 'CASH' | 'CREDIT' | 'NOTCASHORCREDIT';
    notes: string;
    products: {
      product_id: number;
      quantity: number;
      name?: string;
      price?: number;
    }[];
}