import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Spinner from '@/components/atoms/Spinner';
import Modal from '@/components/molecules/Modal';
import RoomGrid from '@/components/organisms/RoomGrid';
import CheckInForm from '@/components/organisms/CheckInForm';
import { roomService, reservationService, guestService } from '@/services';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInData, setCheckInData] = useState({
    guestId: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [roomsData, reservationsData, guestsData] = await Promise.all([
        roomService.getAll(),
        reservationService.getAll(),
        guestService.getAll()
      ]);
      setRooms(roomsData);
      setReservations(reservationsData);
      setGuests(guestsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load hotel data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomStatusChange = async (roomId, newStatus) => {
    try {
      const room = rooms.find(r => r.id === roomId);
      if (!room) return;

      const updatedRoom = await roomService.update(roomId, { ...room, status: newStatus });
      setRooms(rooms.map(r => r.id === roomId ? updatedRoom : r));
      toast.success(`Room ${room.number} status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update room status');
    }
  };

  const handleQuickCheckIn = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room || room.status !== 'available') {
      toast.error('Room not available for check-in');
      return;
    }

    setSelectedRoom(room);
    setCheckInData({
      ...checkInData,
      roomId: roomId,
      checkIn: new Date().toISOString().split('T')[0]
    });
    setShowCheckInModal(true);
  };

  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    try {
      const newReservation = await reservationService.create({
        ...checkInData,
        id: Date.now().toString(),
        status: 'checked-in',
        totalAmount: selectedRoom.price
      });

      await roomService.update(checkInData.roomId, {
        ...selectedRoom,
        status: 'occupied',
        currentGuestId: checkInData.guestId
      });

      setReservations([...reservations, newReservation]);
      setRooms(rooms.map(r =>
        r.id === checkInData.roomId
          ? { ...r, status: 'occupied', currentGuestId: checkInData.guestId }
          : r
      ));

      setShowCheckInModal(false);
      setCheckInData({ guestId: '', roomId: '', checkIn: '', checkOut: '', notes: '' });
      toast.success('Guest checked in successfully!');
    } catch (err) {
      toast.error('Failed to check in guest');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-md p-4 shadow-sm">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <Text as="h3" className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</Text>
          <Text as="p" className="text-gray-500 mb-4">{error}</Text>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden">
      <div className="mb-6">
        <Text as="h2" className="text-2xl font-heading font-semibold text-gray-900 mb-2">Room Management</Text>
        <Text as="p" className="text-gray-600">Manage room availability and guest check-ins</Text>
      </div>

      <RoomGrid
        rooms={rooms}
        guests={guests}
        onQuickCheckIn={handleQuickCheckIn}
        onStatusChange={handleRoomStatusChange}
      />

      {showCheckInModal && (
        <Modal title={`Check-In to Room ${selectedRoom?.number}`} onClose={() => setShowCheckInModal(false)} className="max-w-md">
          <CheckInForm
            checkInData={checkInData}
            setCheckInData={setCheckInData}
            guests={guests}
            selectedRoom={selectedRoom}
            onSubmit={handleCheckInSubmit}
            onClose={() => setShowCheckInModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default RoomManagement;