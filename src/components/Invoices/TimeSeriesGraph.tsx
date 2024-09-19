"use client";
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchAllInvoices } from '@/features/invoices/invoicesSlice';
import { format, startOfDay, startOfWeek, startOfMonth, addDays, addWeeks, addMonths } from 'date-fns';
import { useAppDispatch, useAppSelector } from '@/lib/redux-hooks';

const TimeSeriesGraph = () => {
  const dispatch = useAppDispatch();
  const allInvoices = useAppSelector((state) => state.invoices.allInvoices);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartData, setChartData] = useState<Array<{ date: string; revenue: number }>>([]);

  useEffect(() => {
    dispatch(fetchAllInvoices());
  }, [dispatch]);

  useEffect(() => {
    if (allInvoices.length > 0) {
      const data = processData(allInvoices, timeRange);
      setChartData(data);
    }
  }, [allInvoices, timeRange]);

  const processData = (invoices: typeof allInvoices, range: typeof timeRange) => {
    const revenueMap = new Map<string, number>();

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

      const revenue = invoice.InvoiceDetails.reduce((total, detail) => {
        return total + (detail.quantity * detail.Product.price);
      }, 0);

      if (revenueMap.has(key)) {
        revenueMap.set(key, (revenueMap.get(key) || 0) + revenue);
      } else {
        revenueMap.set(key, revenue);
      }
    });

    const sortedData = Array.from(revenueMap.entries())
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime());

    const filledData: Array<{ date: string; revenue: number }> = [];
    if (sortedData.length > 0) {
      const [firstDate] = sortedData[0];
      const [lastDate] = sortedData[sortedData.length - 1];

      let currentDate = new Date(firstDate);
      const endDate = new Date(lastDate);

      while (currentDate <= endDate) {
        const key = format(currentDate, range === 'monthly' ? 'yyyy-MM' : 'yyyy-MM-dd');
        filledData.push({
          date: key,
          revenue: revenueMap.get(key) || 0
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
    }

    return filledData;
  };

  const formatXAxis = (tickItem: string) => {
    switch (timeRange) {
      case 'daily':
        return format(new Date(tickItem), 'MMM dd');
      case 'weekly':
        return `Week of ${format(new Date(tickItem), 'MMM dd')}`;
      case 'monthly':
        return format(new Date(tickItem), 'MMM yyyy');
    }
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Revenue Projection</CardTitle>
        <div className="space-x-2">
          <Button 
            variant={timeRange === 'daily' ? 'default' : 'outline'} 
            onClick={() => setTimeRange('daily')}
          >
            Daily
          </Button>
          <Button 
            variant={timeRange === 'weekly' ? 'default' : 'outline'} 
            onClick={() => setTimeRange('weekly')}
          >
            Weekly
          </Button>
          <Button 
            variant={timeRange === 'monthly' ? 'default' : 'outline'} 
            onClick={() => setTimeRange('monthly')}
          >
            Monthly
          </Button>
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
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => formatXAxis(value as string)}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
            />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TimeSeriesGraph;