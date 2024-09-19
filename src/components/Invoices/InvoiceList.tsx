'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchInvoices } from '@/features/invoices/invoicesSlice';
import InvoiceCard from './InvoiceCard';
import { Button } from '@/components/ui/button';

const InvoiceList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error, meta } = useSelector((state: RootState) => state.invoices);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchInvoices(1));
    }
  }, [status, dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(fetchInvoices(page));
  };

  if (status === 'loading') {
    return <div className="text-center">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto p-4">
          {items.slice(0, 10).map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              customer={invoice.customer}
              salesperson={invoice.salesperson}
              totalAmount={invoice.InvoiceDetails.reduce((sum, detail) => sum + detail.quantity, 0)}
              notes={invoice.notes}
            />
          ))}
        </div>
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <Button
            onClick={() => handlePageChange(meta.currentPage - 1)}
            disabled={meta.currentPage === 1}
            className="px-3 py-1 text-sm"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-700">
            Page {meta.currentPage} of {meta.totalPages} 
          </span>
          <span className="text-xs text-gray-700">
            Showing {meta.totalItems} results
          </span>
          <Button
            onClick={() => handlePageChange(meta.currentPage + 1)}
            disabled={meta.currentPage === meta.totalPages}
            className="px-3 py-1 text-sm"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;