import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Card from '@/components/molecules/Card';
import Button from '@/components/atoms/Button'; // Assuming QuickAction buttons will be generic buttons

const QuickActionButton = ({ iconName, iconBgColor, title, description, onClick }) => (
  <Button onClick={onClick} className="flex items-center space-x-3 p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
    <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
      <ApperIcon name={iconName} className="w-5 h-5 text-current" />
    </div>
    <div className="text-left">
      <Text as="p" className="font-medium text-gray-900">{title}</Text>
      <Text as="p" className="text-sm text-gray-500">{description}</Text>
    </div>
  </Button>
);

const QuickActions = () => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="p-6"
    >
      <Text as="h3" className="text-lg font-medium text-gray-900 mb-4">Quick Actions</Text>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickActionButton
          iconName="UserPlus"
          iconBgColor="bg-primary/20 text-primary"
          title="New Check-In"
          description="Process guest arrival"
          onClick={() => console.log('New Check-In')} // Placeholder
        />
        <QuickActionButton
          iconName="Calendar"
          iconBgColor="bg-accent/20 text-accent"
          title="New Reservation"
          description="Book a room"
          onClick={() => console.log('New Reservation')} // Placeholder
        />
        <QuickActionButton
          iconName="Bed"
          iconBgColor="bg-success/20 text-success"
          title="Room Status"
          description="Update room availability"
          onClick={() => console.log('Room Status')} // Placeholder
        />
      </div>
    </Card>
  );
};

export default QuickActions;