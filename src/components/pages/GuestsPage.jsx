import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Spinner from '@/components/atoms/Spinner';
import Modal from '@/components/molecules/Modal';
import GuestList from '@/components/organisms/GuestList';
import AddGuestForm from '@/components/organisms/AddGuestForm';
import GuestDetail from '@/components/organisms/GuestDetail';
import { guestService, reservationService, roomService } from '@/services'; // Import roomService for guest history

const GuestsPage = () => {
  const [guests, setGuests] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]); // Added rooms state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewGuestModal, setShowNewGuestModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [newGuest, setNewGuest] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    idDocument: '',
    preferences: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [guestsData, reservationsData, roomsData] = await Promise.all([
        guestService.getAll(),
        reservationService.getAll(),
        roomService.getAll() // Fetch rooms data
      ]);
      setGuests(guestsData);
      setReservations(reservationsData);
      setRooms(roomsData); // Set rooms state
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load guests');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGuest = async (e) => {
    e.preventDefault();
    try {
      const guest = await guestService.create({
        ...newGuest,
        id: Date.now().toString()
      });

      setGuests([...guests, guest]);
      setShowNewGuestModal(false);
      setNewGuest({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        idDocument: '',
        preferences: []
      });
      toast.success('Guest created successfully!');
    } catch (err) {
      toast.error('Failed to create guest');
    }
  };

  const getFilteredGuests = () => {
    return guests.filter(guest => {
      const matchesSearch = !searchTerm ||
        guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.phone.includes(searchTerm);

      return matchesSearch;
    });
  };

  const getGuestHistory = (guestId) => {
    return reservations
      .filter(r => r.guestId === guestId)
      .sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
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
          <Text as="h3" className="text-lg font-medium text-gray-900 mb-2">Error Loading Guests</Text>
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

  const filteredGuests = getFilteredGuests();

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Text as="h1" className="text-2xl font-heading font-semibold text-gray-900 mb-2">Guests</Text>
            <Text as="p" className="text-gray-600">Manage guest information and preferences</Text>
          </div>
          <Button
            onClick={() => setShowNewGuestModal(true)}
            className="bg-primary text-white hover:bg-primary/90 flex items-center space-x-2"
          >
            <ApperIcon name="UserPlus" className="w-4 h-4" />
            <span>Add Guest</span>
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search guests by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2"
          />
        </div>
      </div>

      <GuestList
        guests={filteredGuests}
        reservations={reservations}
        onAddGuestClick={() => setShowNewGuestModal(true)}
        searchTerm={searchTerm}
        onSelectGuest={setSelectedGuest}
      />

      {showNewGuestModal && (
        <Modal title="Add New Guest" onClose={() => setShowNewGuestModal(false)} className="max-w-lg">
          <AddGuestForm
            newGuest={newGuest}
            setNewGuest={setNewGuest}
            onSubmit={handleCreateGuest}
            onClose={() => setShowNewGuestModal(false)}
          />
        </Modal>
      )}

      {selectedGuest && (
        <Modal title="Guest Details" onClose={() => setSelectedGuest(null)} className="max-w-2xl">
          <GuestDetail
            guest={selectedGuest}
            guestHistory={getGuestHistory(selectedGuest.id)}
            rooms={rooms} // Pass rooms down
          />
        </Modal>
      )}
    </div>
  );
};

export default GuestsPage;