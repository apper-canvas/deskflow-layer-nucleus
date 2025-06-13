import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { roomService, reservationService, guestService } from '../services';

const MainFeature = () => {
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

  const handleQuickCheckIn = async (roomId) => {
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

  const getRoomStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-success text-white';
      case 'occupied': return 'bg-error text-white';
      case 'cleaning': return 'bg-warning text-white';
      case 'maintenance': return 'bg-gray-500 text-white';
      default: return 'bg-gray-300 text-gray-700';
    }
  };

  const getRoomStatusIcon = (status) => {
    switch (status) {
      case 'available': return 'CheckCircle';
      case 'occupied': return 'User';
      case 'cleaning': return 'Sparkles';
      case 'maintenance': return 'Wrench';
      default: return 'Circle';
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-500 mb-4">{error}</p>
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
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-2">Room Management</h2>
        <p className="text-gray-600">Manage room availability and guest check-ins</p>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {rooms.map((room, index) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-md shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Room {room.number}</h3>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">Floor {room.floor}</span>
              </div>
            </div>

            <div className="mb-3">
              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getRoomStatusColor(room.status)}`}>
                <ApperIcon name={getRoomStatusIcon(room.status)} className="w-3 h-3" />
                <span className="capitalize">{room.status}</span>
              </span>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">{room.type}</p>
              <p className="text-sm font-medium text-gray-900">${room.price}/night</p>
            </div>

            {room.currentGuestId && (
              <div className="mb-3 p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">Current Guest:</p>
                <p className="text-sm font-medium text-gray-900">
                  {guests.find(g => g.id === room.currentGuestId)?.firstName} {guests.find(g => g.id === room.currentGuestId)?.lastName}
                </p>
              </div>
            )}

            <div className="flex flex-col space-y-2">
              {room.status === 'available' && (
                <button
                  onClick={() => handleQuickCheckIn(room.id)}
                  className="w-full px-3 py-2 bg-primary text-white text-sm rounded hover:bg-primary/90 transition-colors flex items-center justify-center space-x-1"
                >
                  <ApperIcon name="UserPlus" className="w-4 h-4" />
                  <span>Quick Check-In</span>
                </button>
              )}

              <div className="flex space-x-1">
                {room.status === 'occupied' && (
                  <button
                    onClick={() => handleRoomStatusChange(room.id, 'cleaning')}
                    className="flex-1 px-2 py-1 bg-warning text-white text-xs rounded hover:bg-warning/90 transition-colors"
                  >
                    Check Out
                  </button>
                )}
                
                {room.status === 'cleaning' && (
                  <button
                    onClick={() => handleRoomStatusChange(room.id, 'available')}
                    className="flex-1 px-2 py-1 bg-success text-white text-xs rounded hover:bg-success/90 transition-colors"
                  >
                    Clean Done
                  </button>
                )}

                {room.status === 'available' && (
                  <button
                    onClick={() => handleRoomStatusChange(room.id, 'maintenance')}
                    className="flex-1 px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                  >
                    Maintenance
                  </button>
                )}

                {room.status === 'maintenance' && (
                  <button
                    onClick={() => handleRoomStatusChange(room.id, 'available')}
                    className="flex-1 px-2 py-1 bg-success text-white text-xs rounded hover:bg-success/90 transition-colors"
                  >
                    Fixed
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Check-In Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Check-In to Room {selectedRoom?.number}
              </h3>
              <button
                onClick={() => setShowCheckInModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckInSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guest
                </label>
                <select
                  value={checkInData.guestId}
                  onChange={(e) => setCheckInData({ ...checkInData, guestId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Select a guest</option>
                  {guests.map(guest => (
                    <option key={guest.id} value={guest.id}>
                      {guest.firstName} {guest.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-In Date
                  </label>
                  <input
                    type="date"
                    value={checkInData.checkIn}
                    onChange={(e) => setCheckInData({ ...checkInData, checkIn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-Out Date
                  </label>
                  <input
                    type="date"
                    value={checkInData.checkOut}
                    onChange={(e) => setCheckInData({ ...checkInData, checkOut: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={checkInData.notes}
                  onChange={(e) => setCheckInData({ ...checkInData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows="3"
                  placeholder="Any special requests or notes..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Check In Guest
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MainFeature;