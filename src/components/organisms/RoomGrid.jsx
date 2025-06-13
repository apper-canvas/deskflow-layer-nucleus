import React from 'react';
import { motion } from 'framer-motion';
import RoomCard from '@/components/organisms/RoomCard'; // Reusing RoomCard organism

const RoomGrid = ({ rooms, guests, onQuickCheckIn, onStatusChange, onEditRoom, onDeleteRoom }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {rooms.map((room, index) => {
const currentGuest = guests.find(g => g.id === room.currentGuestId);
        const currentGuestName = currentGuest ? `${currentGuest.firstName} ${currentGuest.lastName}` : '';

        return (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
<RoomCard
              room={room}
              currentGuestName={currentGuestName}
              currentGuest={currentGuest}
              onQuickCheckIn={onQuickCheckIn}
              onStatusChange={onStatusChange}
              onEditRoom={onEditRoom}
              onDeleteRoom={onDeleteRoom}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default RoomGrid;