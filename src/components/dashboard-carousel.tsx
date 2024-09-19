import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TimeSeriesGraph from "@/components/Invoices/TimeSeriesGraph";
import InvoiceList from "@/components/Invoices/InvoiceList";

const DashboardCarousel = () => {
  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-1">
        <CarouselItem className="pl-1 md:basis-full">
          <div className="p-1">
            <TimeSeriesGraph />
          </div>
        </CarouselItem>
        <CarouselItem className="pl-1 md:basis-full">
          <div className="p-1">
            <InvoiceList />
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default DashboardCarousel;