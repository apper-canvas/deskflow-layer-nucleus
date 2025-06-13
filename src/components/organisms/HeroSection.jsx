import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Card from '@/components/molecules/Card';

const FeatureCard = ({ iconName, title, description }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    <ApperIcon name={iconName} className="w-8 h-8 text-primary mx-auto mb-2" />
    <Text as="h3" className="font-medium text-gray-900">{title}</Text>
    <Text as="p" className="text-sm text-gray-600">{description}</Text>
  </div>
);

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl w-full text-center"
    >
      <Card className="p-8 md:p-12 shadow-xl">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name="Building" className="w-8 h-8 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4"
        >
          Welcome to DeskFlow Pro
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 mb-8"
        >
          Your comprehensive hotel management system designed for front desk excellence. 
          Streamline check-ins, manage rooms, and deliver exceptional guest experiences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <FeatureCard iconName="Calendar" title="Reservations" description="Manage bookings efficiently" />
          <FeatureCard iconName="Bed" title="Room Status" description="Real-time availability" />
          <FeatureCard iconName="Users" title="Guest Services" description="Complete guest management" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <Button
            onClick={() => navigate('/dashboard')}
            className="w-full md:w-auto px-8 py-3 bg-primary text-white hover:bg-primary/90 font-medium"
          >
            Go to Dashboard
          </Button>
          <Text as="p" className="text-sm text-gray-500">
            Ready to manage your hotel operations with ease
          </Text>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default HeroSection;