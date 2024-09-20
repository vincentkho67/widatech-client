import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { CalendarIcon, UserIcon, DollarSignIcon } from 'lucide-react';

interface InvoiceCardProps {
  customer: string;
  salesperson: string;
  totalAmount: number;
  notes: string;
  created_at: string;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ customer, salesperson, totalAmount, notes, created_at }) => {
  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className="w-full mb-4 hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">{customer}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="w-4 h-4 mr-1" />
            {formattedDate}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
            <span>{salesperson}</span>
          </div>
          <div className="flex items-center">
            <DollarSignIcon className="w-4 h-4 mr-2 text-gray-500" />
            <span>{totalAmount.toFixed(2)}</span>
          </div>
        </div>
        {notes && (
          <p className="mt-3 text-sm text-gray-600">
            <span className="font-medium">Notes:</span> {notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceCard;