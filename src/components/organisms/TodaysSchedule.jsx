import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Card from '@/components/molecules/Card';
import ListItem from '@/components/molecules/ListItem';

const TodaysSchedule = ({ arrivals, departures }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Arrivals */}
      <Card
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Text as="h3" className="text-lg font-medium text-gray-900">Today's Arrivals</Text>
            <ApperIcon name="UserPlus" className="w-5 h-5 text-accent" />
          </div>
        </div>
        <div className="p-6">
          {arrivals.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <Text as="p" className="text-gray-500">No arrivals scheduled for today</Text>
            </div>
          ) : (
            <div className="space-y-4">
              {arrivals.map((arrival, index) => (
                <motion.div
                  key={arrival.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <ListItem
                    icon={
                      <Text as="span" className="text-xs font-medium text-accent">
                        {arrival.guest?.firstName?.[0]}{arrival.guest?.lastName?.[0]}
                      </Text>
                    }
                    iconClassName="bg-accent/20"
                    primaryText={`${arrival.guest?.firstName} ${arrival.guest?.lastName}`}
                    secondaryText={`Room ${arrival.room?.number}`}
                    rightContent={
                      <>
                        <Text as="p" className="text-sm font-medium text-gray-900">${arrival.totalAmount}</Text>
                        <Text as="p" className="text-xs text-gray-500">Check-in</Text>
                      </>
                    }
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Departures */}
      <Card
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Text as="h3" className="text-lg font-medium text-gray-900">Today's Departures</Text>
            <ApperIcon name="UserMinus" className="w-5 h-5 text-warning" />
          </div>
        </div>
        <div className="p-6">
          {departures.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <Text as="p" className="text-gray-500">No departures scheduled for today</Text>
            </div>
          ) : (
            <div className="space-y-4">
              {departures.map((departure, index) => (
                <motion.div
                  key={departure.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <ListItem
                    icon={
                      <Text as="span" className="text-xs font-medium text-warning">
                        {departure.guest?.firstName?.[0]}{departure.guest?.lastName?.[0]}
                      </Text>
                    }
                    iconClassName="bg-warning/20"
                    primaryText={`${departure.guest?.firstName} ${departure.guest?.lastName}`}
                    secondaryText={`Room ${departure.room?.number}`}
                    rightContent={
                      <>
                        <Text as="p" className="text-sm font-medium text-gray-900">${departure.totalAmount}</Text>
                        <Text as="p" className="text-xs text-gray-500">Check-out</Text>
                      </>
                    }
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TodaysSchedule;