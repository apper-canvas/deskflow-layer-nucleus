import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import StatusTag from '@/components/atoms/StatusTag';

const GuestDetail = ({ guest, guestHistory, rooms }) => {
  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
          <Text as="span" className="text-lg font-medium text-primary">
            {guest.firstName[0]}{guest.lastName[0]}
          </Text>
</div>
        <div className="flex items-center justify-between">
          <div>
            <Text as="h3" className="text-xl font-medium text-gray-900">
              {guest.firstName} {guest.lastName}
            </Text>
            <Text as="p" className="text-gray-500">{guest.email}</Text>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => onEdit(guest)}
              className="text-primary hover:text-primary/80 font-medium p-0 bg-transparent hover:bg-transparent"
            >
              Edit
            </Button>
            <Button
              onClick={() => onDelete(guest.id)}
              className="text-error hover:text-error/80 font-medium p-0 bg-transparent hover:bg-transparent"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guest Information */}
        <div className="space-y-4">
          <Text as="h4" className="font-medium text-gray-900">Contact Information</Text>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Phone" className="w-4 h-4 text-gray-400" />
              <Text as="span" className="text-sm text-gray-600">{guest.phone}</Text>
            </div>
            <div className="flex items-center space-x-3">
              <ApperIcon name="Mail" className="w-4 h-4 text-gray-400" />
              <Text as="span" className="text-sm text-gray-600 break-words">{guest.email}</Text>
            </div>
            <div className="flex items-center space-x-3">
              <ApperIcon name="CreditCard" className="w-4 h-4 text-gray-400" />
              <Text as="span" className="text-sm text-gray-600">{guest.idDocument}</Text>
            </div>
{guest.address && (
              <div className="flex items-start space-x-3">
                <ApperIcon name="MapPin" className="w-4 h-4 text-gray-400 mt-0.5" />
                <Text as="span" className="text-sm text-gray-600">{guest.address}</Text>
              </div>
            )}
            {guest.governmentIdProof && (
              <div className="flex items-center space-x-3">
                <ApperIcon name="FileText" className="w-4 h-4 text-gray-400" />
                <Text as="span" className="text-sm text-gray-600">{guest.governmentIdProof}</Text>
              </div>
            )}
            {guest.nationality && (
              <div className="flex items-center space-x-3">
                <ApperIcon name="Globe" className="w-4 h-4 text-gray-400" />
                <Text as="span" className="text-sm text-gray-600">{guest.nationality}</Text>
              </div>
            )}
            {guest.guestType && (
              <div className="flex items-center space-x-3">
                <ApperIcon name="Users" className="w-4 h-4 text-gray-400" />
                <Text as="span" className="text-sm text-gray-600 capitalize">{guest.guestType}</Text>
              </div>
            )}
          </div>
        </div>

        {/* Stay History */}
        <div className="space-y-4">
          <Text as="h4" className="font-medium text-gray-900">Stay History</Text>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {guestHistory.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <Text as="p" className="text-sm text-gray-500">No stay history</Text>
              </div>
            ) : (
              guestHistory.map(reservation => (
                <div key={reservation.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Text as="span" className="text-sm font-medium text-gray-900">
                      {new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}
                    </Text>
                    <StatusTag status={reservation.status} showIcon={false} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <Text as="span">Room {rooms.find(r => r.id === reservation.roomId)?.number}</Text>
                    <Text as="span">${reservation.totalAmount}</Text>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

{/* Preferences and Special Requests */}
      {((guest.preferences && guest.preferences.length > 0) || guest.specialPreferences) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Text as="h4" className="font-medium text-gray-900 mb-3">Preferences & Special Requests</Text>
          {guest.preferences && guest.preferences.length > 0 && (
            <div className="mb-4">
              <Text as="p" className="text-sm text-gray-600 mb-2">General Preferences:</Text>
              <div className="flex flex-wrap gap-2">
                {guest.preferences.map((pref, idx) => (
                  <Text as="span" key={idx} className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full">
                    {pref}
                  </Text>
                ))}
              </div>
            </div>
          )}
          {guest.specialPreferences && (
            <div>
              <Text as="p" className="text-sm text-gray-600 mb-2">Special Requests:</Text>
              <Text as="p" className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{guest.specialPreferences}</Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GuestDetail;