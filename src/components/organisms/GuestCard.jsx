import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Card from '@/components/molecules/Card';
import StatusTag from '@/components/atoms/StatusTag';

const GuestCard = ({ guest, guestHistory, totalStays, currentStay, index, onClick }) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-6 hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <Text as="span" className="text-sm font-medium text-primary">
              {guest.firstName[0]}{guest.lastName[0]}
            </Text>
          </div>
          <div>
            <Text as="h3" className="font-medium text-gray-900">
              {guest.firstName} {guest.lastName}
            </Text>
            {currentStay && (
              <StatusTag status="checked-in" />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Mail" className="w-4 h-4" />
          <Text as="span" className="break-words">{guest.email}</Text>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Phone" className="w-4 h-4" />
          <Text as="span">{guest.phone}</Text>
        </div>
        {guest.address?.city && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="MapPin" className="w-4 h-4" />
            <Text as="span">{guest.address.city}, {guest.address.state}</Text>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <Text as="span" className="text-gray-500">Total Stays: {totalStays}</Text>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400" />
          <Text as="span" className="text-gray-500">
            {guestHistory.length > 0
              ? new Date(guestHistory[0].checkIn).toLocaleDateString()
              : 'No stays'
            }
          </Text>
        </div>
      </div>

      {guest.preferences && guest.preferences.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-1">
            {guest.preferences.slice(0, 3).map((pref, idx) => (
              <Text as="span" key={idx} className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
                {pref}
              </Text>
            ))}
            {guest.preferences.length > 3 && (
              <Text as="span" className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{guest.preferences.length - 3} more
              </Text>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default GuestCard;