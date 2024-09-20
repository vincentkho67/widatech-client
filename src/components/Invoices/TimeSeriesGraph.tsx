"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea, BarChart, Bar } from 'recharts';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchAllInvoices } from '@/features/invoices/invoicesSlice';
import { format, startOfDay, startOfWeek, startOfMonth, addDays, addWeeks, addMonths, parseISO } from 'date-fns';
import { useAppDispatch, useAppSelector } from '@/lib/redux-hooks';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface Invoice {
  id: number;
  amount: number;
  createdAt: string;
}

interface ChartDataPoint {
  date: string;
  revenue: number;
  invoices?: Invoice[];
}

const TimeSeriesGraph: React.FC = () => {
  const dispatch = useAppDispatch();
  const allInvoices = useAppSelector((state) => state.invoices.allInvoices);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [zoomState, setZoomState] = useState<{ start: number | null; end: number | null }>({ start: null, end: null });
  const [originalData, setOriginalData] = useState<ChartDataPoint[]>([]);
  const [selectedInvoices, setSelectedInvoices] = useState<Invoice[] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    dispatch(fetchAllInvoices());
  }, [dispatch]);

  const processData = useCallback((invoices: typeof allInvoices, range: typeof timeRange): ChartDataPoint[] => {
    const revenueMap = new Map<string, { revenue: number; invoices: Invoice[] }>();

    invoices.forEach(invoice => {
      const date = new Date(invoice.createdAt);
      let key: string;

      switch (range) {
        case 'daily':
          key = format(startOfDay(date), 'yyyy-MM-dd');
          break;
        case 'weekly':
          key = format(startOfWeek(date), 'yyyy-MM-dd');
          break;
        case 'monthly':
          key = format(startOfMonth(date), 'yyyy-MM');
          break;
      }

      const revenue = invoice.InvoiceDetails.reduce((total, detail) => 
        total + (detail.quantity * detail.Product.price), 0);

      if (!revenueMap.has(key)) {
        revenueMap.set(key, { revenue: 0, invoices: [] });
      }
      const data = revenueMap.get(key)!;
      data.revenue += revenue;
      data.invoices.push({ id: invoice.id, amount: revenue, createdAt: invoice.createdAt });
    });

    const sortedData = Array.from(revenueMap.entries())
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime());

    if (sortedData.length === 0) return [];

    const [firstDate] = sortedData[0];
    const [lastDate] = sortedData[sortedData.length - 1];

    let currentDate = new Date(firstDate);
    const endDate = new Date(lastDate);
    const filledData: ChartDataPoint[] = [];

    while (currentDate <= endDate) {
      const key = format(currentDate, range === 'monthly' ? 'yyyy-MM' : 'yyyy-MM-dd');
      const data = revenueMap.get(key);
      filledData.push({
        date: key,
        revenue: data ? data.revenue : 0,
        invoices: data ? data.invoices : []
      });

      switch (range) {
        case 'daily':
          currentDate = addDays(currentDate, 1);
          break;
        case 'weekly':
          currentDate = addWeeks(currentDate, 1);
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, 1);
          break;
      }
    }

    return filledData;
  }, []);

  useEffect(() => {
    if (allInvoices.length > 0) {
      const data = processData(allInvoices, timeRange);
      setChartData(data);
      setOriginalData(data);
    }
  }, [allInvoices, timeRange, processData]);

  const formatXAxis = useCallback((tickItem: string) => {
    switch (timeRange) {
      case 'daily':
        return format(new Date(tickItem), 'MMM dd');
      case 'weekly':
        return `Week of ${format(new Date(tickItem), 'MMM dd')}`;
      case 'monthly':
        return format(new Date(tickItem), 'MMM yyyy');
    }
  }, [timeRange]);

  const fetchZoomedData = useCallback(async (date: string) => {
    try {
      const response = await axios.get('http://localhost:8080/api/invoices/bySpecificDate', {
        params: { date, timeRange }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching zoomed data:', error);
      return [];
    }
  }, [timeRange]);

  const handleClick = useCallback((event: any) => {
    if (!chartData.length) return;

    const index = event.activeTooltipIndex;
    if (index === undefined) return;

    const clickedData = chartData[index];
    if (clickedData.invoices && clickedData.invoices.length > 0) {
      setSelectedInvoices(clickedData.invoices);
      setIsDialogOpen(true);
    }
  }, [chartData]);

  const handleZoomOut = useCallback(() => {
    setChartData(originalData);
    setZoomState({ start: null, end: null });
  }, [originalData]);

  const isZoomedIn = useMemo(() => chartData.length !== originalData.length, [chartData, originalData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-4 border rounded shadow">
          <p className="label">{`Date: ${formatXAxis(label)}`}</p>
          <p className="revenue">{`Revenue: $${payload[0].value.toFixed(2)}`}</p>
          <p>Click to view invoice details</p>
        </div>
      );
    }
    return null;
  };

  const formatInvoiceDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM dd, HH:mm');
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Revenue Projection</CardTitle>
        <div className="space-x-2">
          {['daily', 'weekly', 'monthly'].map((range) => (
            <Button 
              key={range}
              variant={timeRange === range ? 'default' : 'outline'} 
              onClick={() => setTimeRange(range as typeof timeRange)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
          {isZoomedIn && (
            <Button onClick={handleZoomOut}>Back</Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            onClick={handleClick}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
            {zoomState.start !== null && chartData[zoomState.start] && (
              <ReferenceArea
                x1={chartData[zoomState.start].date}
                x2={chartData[chartData.length - 1].date}
                strokeOpacity={0.3}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          <div className="mt-4" style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={selectedInvoices || []}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="createdAt" 
                  tickFormatter={formatInvoiceDate}
                  label={{ value: 'Creation Time', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: '', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  labelFormatter={formatInvoiceDate}
                  formatter={(value: number, name: string, props: any) => [`$${value.toFixed(2)}`, `Invoice #${props.payload.id}`]}
                />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TimeSeriesGraph;