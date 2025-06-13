import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Card from '@/components/molecules/Card';

const StatCard = ({ iconName, iconBgColor, title, value, description, delay }) => (
  <Card
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="p-6"
  >
    <div className="flex items-center justify-between">
      <div>
        <Text as="p" className="text-sm font-medium text-gray-600">{title}</Text>
        <Text as="p" className="text-2xl font-bold text-primary">{value}</Text>
        <Text as="p" className="text-xs text-gray-500">{description}</Text>
      </div>
      <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
        <ApperIcon name={iconName} className="w-6 h-6 text-current" />
      </div>
    </div>
  </Card>
);

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Occupancy Rate"
        value={`${stats.occupancyRate}%`}
        description={`${stats.occupiedRooms} of ${stats.totalRooms} rooms`}
        iconName="Building"
        iconBgColor="bg-primary/10 text-primary"
        delay={0.1}
      />
      <StatCard
        title="Available Rooms"
        value={stats.availableRooms}
        description="Ready for check-in"
        iconName="CheckCircle"
        iconBgColor="bg-success/10 text-success"
        delay={0.2}
      />
      <StatCard
        title="Today's Arrivals"
        value={stats.todayArrivals}
        description="Expected check-ins"
        iconName="UserPlus"
        iconBgColor="bg-accent/10 text-accent"
        delay={0.3}
      />
      <StatCard
        title="Today's Departures"
        value={stats.todayDepartures}
        description="Expected check-outs"
        iconName="UserMinus"
        iconBgColor="bg-warning/10 text-warning"
        delay={0.4}
      />
    </div>
  );
};

export default DashboardStats;