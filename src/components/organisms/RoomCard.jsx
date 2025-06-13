import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import StatusTag from '@/components/atoms/StatusTag';
import Card from '@/components/molecules/Card';
import Modal from '@/components/molecules/Modal';
const RoomCard = ({ room, currentGuestName, currentGuest, onQuickCheckIn, onStatusChange }) => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleCheckout = () => {
    setShowCheckoutModal(false);
    onStatusChange(room.id, 'cleaning');
  };

  const getGuestTooltip = (guest) => {
    if (!guest) return '';
    
    const checkInDate = guest.checkInDate ? new Date(guest.checkInDate).toLocaleDateString() : 'N/A';
    const checkOutDate = guest.checkOutDate ? new Date(guest.checkOutDate).toLocaleDateString() : 'N/A';
    const duration = guest.checkInDate && guest.checkOutDate 
      ? Math.ceil((new Date(guest.checkOutDate) - new Date(guest.checkInDate)) / (1000 * 60 * 60 * 24))
      : 'N/A';
    
    return `Check-in: ${checkInDate}\nDuration: ${duration} days\nContact: ${guest.phone || 'N/A'}`;
  };

  return (
    <>
      <Card className="p-4 hover:shadow-md">
        <div className="flex items-center justify-between mb-3">
          <Text as="h3" className="font-medium text-gray-900">Room {room.number}</Text>
          <div className="flex items-center space-x-1">
            <Text as="span" className="text-xs text-gray-500">Floor {room.floor}</Text>
          </div>
        </div>

        <div className="mb-3">
          <StatusTag status={room.status} />
        </div>

        <div className="mb-3">
          <Text as="p" className="text-sm text-gray-600 mb-1">{room.type}</Text>
          <Text as="p" className="text-sm font-medium text-gray-900">${room.price}/night</Text>
        </div>

        {currentGuestName && (
          <div className="mb-3 p-2 bg-gray-50 rounded">
            <Text as="p" className="text-xs text-gray-600">Current Guest:</Text>
            <Text 
              as="p" 
              className="text-sm font-medium text-gray-900 cursor-help"
              title={getGuestTooltip(currentGuest)}
            >
              {currentGuestName}
            </Text>
          </div>
        )}

        <div className="flex flex-col space-y-2">
          {room.status === 'available' && (
            <Button
              onClick={() => onQuickCheckIn(room.id)}
              className="w-full bg-primary text-white text-sm hover:bg-primary/90 flex items-center justify-center space-x-1"
            >
              <ApperIcon name="UserPlus" className="w-4 h-4" />
              <span>Quick Check-In</span>
            </Button>
          )}

          <div className="flex space-x-1">
            {room.status === 'occupied' && (
              <Button
                onClick={() => setShowCheckoutModal(true)}
                className="flex-1 bg-warning text-white text-xs hover:bg-warning/90"
              >
                Check Out
              </Button>
            )}

            {room.status === 'cleaning' && (
              <Button
                onClick={() => onStatusChange(room.id, 'available')}
                className="flex-1 bg-success text-white text-xs hover:bg-success/90"
              >
                Clean Done
              </Button>
            )}

            {room.status === 'available' && (
              <Button
                onClick={() => onStatusChange(room.id, 'maintenance')}
                className="flex-1 bg-gray-500 text-white text-xs hover:bg-gray-600"
              >
                Maintenance
              </Button>
            )}

            {room.status === 'maintenance' && (
              <Button
                onClick={() => onStatusChange(room.id, 'available')}
                className="flex-1 bg-success text-white text-xs hover:bg-success/90"
              >
                Fixed
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Modal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        title="Confirm Checkout"
      >
        <div className="p-4">
          <Text as="p" className="text-gray-600 mb-4">
            Are you sure you want to check out {currentGuestName} from Room {room.number}?
          </Text>
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => setShowCheckoutModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCheckout}
              className="px-4 py-2 bg-warning text-white hover:bg-warning/90"
            >
              Confirm Checkout
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RoomCard;