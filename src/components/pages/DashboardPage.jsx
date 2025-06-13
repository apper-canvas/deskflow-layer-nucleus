import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Spinner from '@/components/atoms/Spinner';
import DashboardStats from '@/components/organisms/DashboardStats';
import TodaysSchedule from '@/components/organisms/TodaysSchedule';
import QuickActions from '@/components/organisms/QuickActions';
import { roomService, reservationService, guestService } from '@/services';

const DashboardPage = () => {
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
          <Text as="h3" className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</Text>
          <Text as="p" className="text-gray-500 mb-4">{error}</Text>
          <Button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white hover:bg-primary/90"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-8">
        <Text as="h1" className="text-2xl font-heading font-semibold text-gray-900 mb-2">Dashboard</Text>
        <Text as="p" className="text-gray-600">Welcome back! Here's your hotel overview for today.</Text>
      </div>

      <DashboardStats stats={stats} />
      <TodaysSchedule arrivals={getTodayArrivals()} departures={getTodayDepartures()} />
      <QuickActions />
    </div>
  );
};

export default DashboardPage;