import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const NotFoundSection = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-primary" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-heading font-bold text-gray-900 mb-4"
      >
        404 - Page Not Found
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-gray-600 mb-8 max-w-md mx-auto"
      >
        The page you're looking for doesn't exist or has been moved.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-x-4"
      >
        <Button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-primary text-white hover:bg-primary/90 font-medium"
        >
          Go to Dashboard
        </Button>
        <Button
          onClick={() => navigate(-1)}
          className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
        >
          Go Back
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default NotFoundSection;