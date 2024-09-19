import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Invoice {
  id: number;
  customer: string;
  salesperson: string;
  payment_type: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  InvoiceDetails: Array<{
    id: number;
    quantity: number;
    invoice_id: number;
    product_id: number;
    Product: {
      id: number;
      name: string;
      picture_url: string;
      stock: number;
      price: number;
    };
  }>;
}

interface InvoicesState {
  items: Invoice[];
  allInvoices: Invoice[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  meta: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

const initialState: InvoicesState = {
  items: [],
  allInvoices: [],
  status: 'idle',
  error: null,
  meta: {
    totalItems: 0,
    itemsPerPage: 10,
    currentPage: 1,
    totalPages: 1,
  },
};

export const fetchAllInvoices = createAsyncThunk(
  'invoices/fetchAllInvoices',
  async () => {
    const response = await axios.get('http://localhost:8080/api/invoices/all');
    return response.data;
  }
);

export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (page: number) => {
    const response = await axios.get(`http://localhost:8080/api/invoices?page=${page}`);
    return response.data;
  }
);

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInvoices.fulfilled, (state, action: PayloadAction<{ data: Invoice[], meta: InvoicesState['meta'] }>) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch invoices';
      })
      .addCase(fetchAllInvoices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllInvoices.fulfilled, (state, action: PayloadAction<Invoice[]>) => {
        state.status = 'succeeded';
        state.allInvoices = action.payload;
      })
      .addCase(fetchAllInvoices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch all invoices';
      });
  },
});

export default invoicesSlice.reducer;