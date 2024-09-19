'use client';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Product = () => {
  return (
    <>
      <Button
        onClick={() => toast({ title: 'Test', description: 'This is a test toast' })}
        className="mt-4"
      >
        Test Toast
      </Button>
    </>
  );
};

export default Product;
