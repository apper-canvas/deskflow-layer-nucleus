import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', initial, animate, transition, onClick, ...props }) => {
  const cardContent = (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );

  if (initial || animate || transition) {
    return (
      <motion.div initial={initial} animate={animate} transition={transition}>
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

export default Card;