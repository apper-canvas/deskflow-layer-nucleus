import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Spinner from '@/components/atoms/Spinner';
import Modal from '@/components/molecules/Modal';
import ReservationFilters from '@/components/organisms/ReservationFilters';
import ReservationTable from '@/components/organisms/ReservationTable';
import NewReservationForm from '@/components/organisms/NewReservationForm';
import { reservationService, guestService, roomService } from '@/services';

const ReservationsPage = () => {
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
    roomIds: [],
    checkIn: '',
    checkOut: '',
    status: 'confirmed',
    notes: '',
    paymentMethod: '',
    discountAmount: '',
    extraCharges: '',
    extraChargesDescription: '',
    paymentStatus: 'pending'
  });
  const [editReservation, setEditReservation] = useState(null);
  const [showEditReservationModal, setShowEditReservationModal] = useState(false);

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
      const selectedRooms = rooms.filter(room => 
        (newReservation.roomIds || []).includes(room.id)
      );
      const baseAmount = selectedRooms.reduce((total, room) => total + room.price, 0);
      
      const reservation = await reservationService.create({
        ...newReservation,
        id: Date.now().toString(),
        totalAmount: baseAmount,
        additionalFees: parseFloat(newReservation.extraCharges) || 0,
        discountAmount: parseFloat(newReservation.discountAmount) || 0,
        paymentMethod: newReservation.paymentMethod,
        paymentStatus: newReservation.paymentMethod === 'cash' ? 'paid' : 'pending'
      });

      setReservations([...reservations, reservation]);
      setShowNewReservationModal(false);
setNewReservation({
        guestId: '',
        roomIds: [],
        checkIn: '',
        checkOut: '',
        status: 'confirmed',
        notes: '',
        paymentMethod: '',
        discountAmount: '',
        extraCharges: '',
        extraChargesDescription: '',
        paymentStatus: 'pending'
      });
      
      // Show invoice/receipt
      if (reservation.paymentBreakdown) {
        toast.success(`Reservation created! Total: $${reservation.paymentBreakdown.total.toFixed(2)}`);
      } else {
        toast.success('Reservation created successfully!');
      }
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

const handleEditReservation = (reservation) => {
    setEditReservation({
      ...reservation,
      roomIds: reservation.roomIds || (reservation.roomId ? [reservation.roomId] : []),
      checkIn: reservation.checkIn.split('T')[0],
      checkOut: reservation.checkOut.split('T')[0]
    });
    setShowEditReservationModal(true);
  };

  const handleUpdateReservation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedReservation = await reservationService.update(editReservation.id, {
        ...editReservation,
        checkIn: new Date(editReservation.checkIn).toISOString(),
        checkOut: new Date(editReservation.checkOut).toISOString()
      });

      setReservations(reservations.map(r =>
        r.id === editReservation.id ? updatedReservation : r
      ));
      toast.success('Reservation updated successfully');
      setShowEditReservationModal(false);
      setEditReservation(null);
    } catch (err) {
      toast.error('Failed to update reservation');
    } finally {
      setLoading(false);
    }
  };

const handleDeleteReservation = async (reservationId) => {
    if (!confirm('Are you sure you want to delete this reservation?')) return;
    
    try {
      await reservationService.delete(reservationId);
      setReservations(reservations.filter(r => r.id !== reservationId));
      toast.success('Reservation deleted successfully');
    } catch (err) {
      toast.error('Failed to delete reservation');
    }
  };

  const getFilteredReservations = () => {
return reservations
      .filter(reservation => {
        const guest = guests.find(g => g.id === reservation.guestId);
        const reservationRoomIds = reservation.roomIds || (reservation.roomId ? [reservation.roomId] : []);
        const reservationRooms = rooms.filter(r => reservationRoomIds.includes(r.id));

        const matchesSearch = !searchTerm ||
          guest?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guest?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guest?.phone?.includes(searchTerm) ||
          reservationRooms.some(room => room?.number?.includes(searchTerm)) ||
          reservation.id.includes(searchTerm);

        const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));
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
          <Text as="h3" className="text-lg font-medium text-gray-900 mb-2">Error Loading Reservations</Text>
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

  const filteredReservations = getFilteredReservations();

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Text as="h1" className="text-2xl font-heading font-semibold text-gray-900 mb-2">Reservations</Text>
            <Text as="p" className="text-gray-600">Manage hotel bookings and guest reservations</Text>
          </div>
          <Button
            onClick={() => setShowNewReservationModal(true)}
            className="bg-primary text-white hover:bg-primary/90 flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>New Reservation</span>
          </Button>
        </div>

        <ReservationFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </div>

<ReservationTable
        reservations={filteredReservations}
        guests={guests}
        rooms={rooms}
        handleStatusChange={handleStatusChange}
        onNewReservationClick={() => setShowNewReservationModal(true)}
        onEditReservation={handleEditReservation}
        onDeleteReservation={handleDeleteReservation}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
      />

{showNewReservationModal && (
        <Modal title="New Reservation" onClose={() => setShowNewReservationModal(false)} className="max-w-md">
          <NewReservationForm
            newReservation={newReservation}
            setNewReservation={setNewReservation}
            guests={guests}
            rooms={rooms}
            onSubmit={handleCreateReservation}
            onClose={() => setShowNewReservationModal(false)}
          />
        </Modal>
      )}

      {showEditReservationModal && (
        <Modal title="Edit Reservation" onClose={() => setShowEditReservationModal(false)} className="max-w-md">
          <NewReservationForm
            newReservation={editReservation}
            setNewReservation={setEditReservation}
            guests={guests}
            rooms={rooms}
            onSubmit={handleUpdateReservation}
            onClose={() => setShowEditReservationModal(false)}
            isEdit={true}
          />
        </Modal>
      )}
    </div>
  );
};

export default ReservationsPage;