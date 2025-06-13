import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import GuestCard from '@/components/organisms/GuestCard'; // Reuse the GuestCard organism

const GuestList = ({ guests, reservations, onAddGuestClick, searchTerm, onSelectGuest }) => {
  const getGuestHistory = (guestId) => {
    return reservations
      .filter(r => r.guestId === guestId)
      .sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));
  };

  if (guests.length === 0) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="Users" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <Text as="h3" className="text-lg font-medium text-gray-900 mb-2">No Guests Found</Text>
        <Text as="p" className="text-gray-500 mb-4">
          {searchTerm
            ? 'No guests match your search criteria'
            : 'Get started by adding your first guest'
          }
        </Text>
        <Button
          onClick={onAddGuestClick}
          className="px-4 py-2 bg-primary text-white hover:bg-primary/90"
        >
          Add Guest
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {guests.map((guest, index) => {
        const guestHistory = getGuestHistory(guest.id);
        const totalStays = guestHistory.length;
        const currentStay = guestHistory.find(r => r.status === 'checked-in');

        return (
          <GuestCard
            key={guest.id}
            guest={guest}
            guestHistory={guestHistory}
            totalStays={totalStays}
            currentStay={currentStay}
            index={index}
            onClick={() => onSelectGuest(guest)}
          />
        );
      })}
    </div>
  );
};

export default GuestList;