import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimatedText = ({ text }: { text: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="text-4xl font-bold text-primary"
    >
      {text}
    </motion.div>
  );
};

const WidaTechAnimation = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2000); // Show content after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      {!showContent ? (
        <AnimatedText text="WidaTech POS" />
      ) : null}
    </div>
  );
};

export default WidaTechAnimation;