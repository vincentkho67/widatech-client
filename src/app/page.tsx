"use client";

import { useEffect, useState } from "react";
import WidaTechAnimation from "@/components/animation/WidaTechAnimation";
import DashboardCarousel from "@/components/dashboard-carousel";

const Home = () => {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {showAnimation ? (
        <WidaTechAnimation />
      ) : (
        <DashboardCarousel />
      )}
    </div>
  );
};

export default Home;