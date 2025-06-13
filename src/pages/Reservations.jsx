import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { reservationService, guestService, roomService } from '../services';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewReservationModal, setShowNewReservationModal] = useState(false);
  const [newReservation, setNewReservation] = useState({
    guestId: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    status: 'confirmed',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reservationsData, guestsData, roomsData] = await Promise.all([
        reservationService.getAll(),
        guestService.getAll(),
        roomService.getAll()
      ]);
      setReservations(reservationsData);
      setGuests(guestsData);
      setRooms(roomsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReservation = async (e) => {
    e.preventDefault();
    try {
      const room = rooms.find(r => r.id === newReservation.roomId);
      const reservation = await reservationService.create({
        ...newReservation,
        id: Date.now().toString(),
        totalAmount: room?.price || 0
      });
      
      setReservations([...reservations, reservation]);
      setShowNewReservationModal(false);
      setNewReservation({
        guestId: '',
        roomId: '',
        checkIn: '',
        checkOut: '',
        status: 'confirmed',
        notes: ''
      });
      toast.success('Reservation created successfully!');
    } catch (err) {
      toast.error('Failed to create reservation');
    }
  };

  const handleStatusChange = async (reservationId, newStatus) => {
    try {
      const reservation = reservations.find(r => r.id === reservationId);
      if (!reservation) return;

      const updatedReservation = await reservationService.update(reservationId, {
        ...reservation,
        status: newStatus
      });
      
      setReservations(reservations.map(r => 
        r.id === reservationId ? updatedReservation : r
      ));
      toast.success(`Reservation ${newStatus} successfully`);
    } catch (err) {
      toast.error('Failed to update reservation status');
    }
  };

  const getFilteredReservations = () => {
    return reservations
      .filter(reservation => {
        const guest = guests.find(g => g.id === reservation.guestId);
        const room = rooms.find(r => r.id === reservation.roomId);
        
        const matchesSearch = !searchTerm || 
          guest?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guest?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guest?.phone?.includes(searchTerm) ||
          room?.number?.includes(searchTerm) ||
          reservation.id.includes(searchTerm);
        
        const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-success text-white';
      case 'checked-in': return 'bg-primary text-white';
      case 'checked-out': return 'bg-gray-500 text-white';
      case 'cancelled': return 'bg-error text-white';
      default: return 'bg-gray-300 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return 'CheckCircle';
      case 'checked-in': return 'User';
      case 'checked-out': return 'UserCheck';
      case 'cancelled': return 'XCircle';
      default: return 'Circle';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Reservations</h3>
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

  const filteredReservations = getFilteredReservations();

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-heading font-semibold text-gray-900 mb-2">Reservations</h1>
            <p className="text-gray-600">Manage hotel bookings and guest reservations</p>
          </div>
          <button
            onClick={() => setShowNewReservationModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>New Reservation</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by guest name, phone, room, or confirmation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked-in">Checked In</option>
            <option value="checked-out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Reservations List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reservations Found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'No reservations match your search criteria' 
                : 'Get started by creating your first reservation'
              }
            </p>
            <button
              onClick={() => setShowNewReservationModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Create Reservation
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-In
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-Out
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reservation, index) => {
                  const guest = guests.find(g => g.id === reservation.guestId);
                  const room = rooms.find(r => r.id === reservation.roomId);
                  
                  return (
                    <motion.tr
                      key={reservation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xs font-medium text-primary">
                              {guest?.firstName?.[0]}{guest?.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {guest?.firstName} {guest?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{guest?.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Room {room?.number}</div>
                        <div className="text-sm text-gray-500">{room?.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(reservation.checkIn).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(reservation.checkOut).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                          <ApperIcon name={getStatusIcon(reservation.status)} className="w-3 h-3 mr-1" />
                          {reservation.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${reservation.totalAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {reservation.status === 'confirmed' && (
                            <button
                              onClick={() => handleStatusChange(reservation.id, 'checked-in')}
                              className="text-primary hover:text-primary/80 font-medium"
                            >
                              Check In
                            </button>
                          )}
                          {reservation.status === 'checked-in' && (
                            <button
                              onClick={() => handleStatusChange(reservation.id, 'checked-out')}
                              className="text-warning hover:text-warning/80 font-medium"
                            >
                              Check Out
                            </button>
                          )}
                          {reservation.status === 'confirmed' && (
                            <button
                              onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                              className="text-error hover:text-error/80 font-medium"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Reservation Modal */}
      {showNewReservationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">New Reservation</h3>
              <button
                onClick={() => setShowNewReservationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guest
                </label>
                <select
                  value={newReservation.guestId}
                  onChange={(e) => setNewReservation({ ...newReservation, guestId: e.target.value })}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room
                </label>
                <select
                  value={newReservation.roomId}
                  onChange={(e) => setNewReservation({ ...newReservation, roomId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Select a room</option>
                  {rooms.filter(room => room.status === 'available').map(room => (
                    <option key={room.id} value={room.id}>
                      Room {room.number} - {room.type} (${room.price}/night)
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
                    value={newReservation.checkIn}
                    onChange={(e) => setNewReservation({ ...newReservation, checkIn: e.target.value })}
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
                    value={newReservation.checkOut}
                    onChange={(e) => setNewReservation({ ...newReservation, checkOut: e.target.value })}
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
                  value={newReservation.notes}
                  onChange={(e) => setNewReservation({ ...newReservation, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows="3"
                  placeholder="Any special requests or notes..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewReservationModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Create Reservation
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Reservations;