import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { roomService, reservationService, guestService } from '../services';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    const availableRooms = rooms.filter(r => r.status === 'available').length;
    const cleaningRooms = rooms.filter(r => r.status === 'cleaning').length;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    
    const today = new Date().toISOString().split('T')[0];
    const todayArrivals = reservations.filter(r => r.checkIn === today && r.status === 'confirmed').length;
    const todayDepartures = reservations.filter(r => r.checkOut === today && r.status === 'checked-in').length;
    
    return {
      totalRooms,
      occupiedRooms,
      availableRooms,
      cleaningRooms,
      occupancyRate,
      todayArrivals,
      todayDepartures
    };
  };

  const stats = getStats();

  const getTodayArrivals = () => {
    const today = new Date().toISOString().split('T')[0];
    return reservations
      .filter(r => r.checkIn === today && r.status === 'confirmed')
      .map(reservation => ({
        ...reservation,
        guest: guests.find(g => g.id === reservation.guestId),
        room: rooms.find(r => r.id === reservation.roomId)
      }))
      .slice(0, 5);
  };

  const getTodayDepartures = () => {
    const today = new Date().toISOString().split('T')[0];
    return reservations
      .filter(r => r.checkOut === today && r.status === 'checked-in')
      .map(reservation => ({
        ...reservation,
        guest: guests.find(g => g.id === reservation.guestId),
        room: rooms.find(r => r.id === reservation.roomId)
      }))
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
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
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-semibold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your hotel overview for today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-primary">{stats.occupancyRate}%</p>
              <p className="text-xs text-gray-500">{stats.occupiedRooms} of {stats.totalRooms} rooms</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Building" className="w-6 h-6 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Rooms</p>
              <p className="text-2xl font-bold text-success">{stats.availableRooms}</p>
              <p className="text-xs text-gray-500">Ready for check-in</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-success" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Arrivals</p>
              <p className="text-2xl font-bold text-accent">{stats.todayArrivals}</p>
              <p className="text-xs text-gray-500">Expected check-ins</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserPlus" className="w-6 h-6 text-accent" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Departures</p>
              <p className="text-2xl font-bold text-warning">{stats.todayDepartures}</p>
              <p className="text-xs text-gray-500">Expected check-outs</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserMinus" className="w-6 h-6 text-warning" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Arrivals */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Today's Arrivals</h3>
              <ApperIcon name="UserPlus" className="w-5 h-5 text-accent" />
            </div>
          </div>
          <div className="p-6">
            {getTodayArrivals().length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No arrivals scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getTodayArrivals().map((arrival, index) => (
                  <motion.div
                    key={arrival.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-accent">
                          {arrival.guest?.firstName?.[0]}{arrival.guest?.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {arrival.guest?.firstName} {arrival.guest?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">Room {arrival.room?.number}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${arrival.totalAmount}</p>
                      <p className="text-xs text-gray-500">Check-in</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Departures */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Today's Departures</h3>
              <ApperIcon name="UserMinus" className="w-5 h-5 text-warning" />
            </div>
          </div>
          <div className="p-6">
            {getTodayDepartures().length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No departures scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getTodayDepartures().map((departure, index) => (
                  <motion.div
                    key={departure.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-warning">
                          {departure.guest?.firstName?.[0]}{departure.guest?.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {departure.guest?.firstName} {departure.guest?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">Room {departure.room?.number}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${departure.totalAmount}</p>
                      <p className="text-xs text-gray-500">Check-out</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserPlus" className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">New Check-In</p>
              <p className="text-sm text-gray-500">Process guest arrival</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-accent/5 rounded-lg hover:bg-accent/10 transition-colors">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" className="w-5 h-5 text-accent" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">New Reservation</p>
              <p className="text-sm text-gray-500">Book a room</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-success/5 rounded-lg hover:bg-success/10 transition-colors">
            <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Bed" className="w-5 h-5 text-success" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Room Status</p>
              <p className="text-sm text-gray-500">Update room availability</p>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;