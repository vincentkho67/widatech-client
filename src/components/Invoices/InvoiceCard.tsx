import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface InvoiceCardProps {
  customer: string;
  salesperson: string;
  totalAmount: number;
  notes: string;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ customer, salesperson, totalAmount, notes }) => {
  return (
    <Card className="w-full mb-4 hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{customer}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p><span className="font-medium">Salesperson:</span> {salesperson}</p>
          <p><span className="font-medium">Total Amount:</span> ${totalAmount.toFixed(2)}</p>
        </div>
        {notes && (
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-medium">Notes:</span> {notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceCard;