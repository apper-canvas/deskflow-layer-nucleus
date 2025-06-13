import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { guestService, reservationService } from '../services';

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [reservations, setReservations] = useState([]);
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
      const [guestsData, reservationsData] = await Promise.all([
        guestService.getAll(),
        reservationService.getAll()
      ]);
      setGuests(guestsData);
      setReservations(reservationsData);
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Guests</h3>
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

  const filteredGuests = getFilteredGuests();

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-heading font-semibold text-gray-900 mb-2">Guests</h1>
            <p className="text-gray-600">Manage guest information and preferences</p>
          </div>
          <button
            onClick={() => setShowNewGuestModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center space-x-2"
          >
            <ApperIcon name="UserPlus" className="w-4 h-4" />
            <span>Add Guest</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search guests by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Guests Grid */}
      {filteredGuests.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Users" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Guests Found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? 'No guests match your search criteria' 
              : 'Get started by adding your first guest'
            }
          </p>
          <button
            onClick={() => setShowNewGuestModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Add Guest
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuests.map((guest, index) => {
            const guestHistory = getGuestHistory(guest.id);
            const totalStays = guestHistory.length;
            const currentStay = guestHistory.find(r => r.status === 'checked-in');
            
            return (
              <motion.div
                key={guest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedGuest(guest)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {guest.firstName[0]}{guest.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {guest.firstName} {guest.lastName}
                      </h3>
                      {currentStay && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success text-white">
                          <ApperIcon name="User" className="w-3 h-3 mr-1" />
                          Currently Checked In
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <ApperIcon name="Mail" className="w-4 h-4" />
                    <span className="break-words">{guest.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <ApperIcon name="Phone" className="w-4 h-4" />
                    <span>{guest.phone}</span>
                  </div>
                  {guest.address?.city && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ApperIcon name="MapPin" className="w-4 h-4" />
                      <span>{guest.address.city}, {guest.address.state}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total Stays: {totalStays}</span>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">
                      {guestHistory.length > 0 
                        ? new Date(guestHistory[0].checkIn).toLocaleDateString()
                        : 'No stays'
                      }
                    </span>
                  </div>
                </div>

                {guest.preferences && guest.preferences.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex flex-wrap gap-1">
                      {guest.preferences.slice(0, 3).map((pref, idx) => (
                        <span key={idx} className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
                          {pref}
                        </span>
                      ))}
                      {guest.preferences.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{guest.preferences.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* New Guest Modal */}
      {showNewGuestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Guest</h3>
              <button
                onClick={() => setShowNewGuestModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGuest} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={newGuest.firstName}
                    onChange={(e) => setNewGuest({ ...newGuest, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={newGuest.lastName}
                    onChange={(e) => setNewGuest({ ...newGuest, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Document Number
                </label>
                <input
                  type="text"
                  value={newGuest.idDocument}
                  onChange={(e) => setNewGuest({ ...newGuest, idDocument: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Driver's License, Passport, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={newGuest.address.street}
                  onChange={(e) => setNewGuest({ 
                    ...newGuest, 
                    address: { ...newGuest.address, street: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newGuest.address.city}
                    onChange={(e) => setNewGuest({ 
                      ...newGuest, 
                      address: { ...newGuest.address, city: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={newGuest.address.state}
                    onChange={(e) => setNewGuest({ 
                      ...newGuest, 
                      address: { ...newGuest.address, state: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewGuestModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Add Guest
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Guest Detail Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-primary">
                    {selectedGuest.firstName[0]}{selectedGuest.lastName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900">
                    {selectedGuest.firstName} {selectedGuest.lastName}
                  </h3>
                  <p className="text-gray-500">{selectedGuest.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGuest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Guest Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Phone" className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{selectedGuest.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="Mail" className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 break-words">{selectedGuest.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="CreditCard" className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{selectedGuest.idDocument}</span>
                  </div>
                  {selectedGuest.address?.street && (
                    <div className="flex items-start space-x-3">
                      <ApperIcon name="MapPin" className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="text-sm text-gray-600">
                        <p>{selectedGuest.address.street}</p>
                        <p>
                          {selectedGuest.address.city}, {selectedGuest.address.state} {selectedGuest.address.zipCode}
                        </p>
                        {selectedGuest.address.country && <p>{selectedGuest.address.country}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stay History */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Stay History</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {getGuestHistory(selectedGuest.id).map(reservation => (
                    <div key={reservation.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(reservation.checkIn).toLocaleDateString()} - {new Date(reservation.checkOut).toLocaleDateString()}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          reservation.status === 'checked-in' ? 'bg-success text-white' :
                          reservation.status === 'checked-out' ? 'bg-gray-500 text-white' :
                          reservation.status === 'confirmed' ? 'bg-primary text-white' :
                          'bg-error text-white'
                        }`}>
                          {reservation.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Room {rooms.find(r => r.id === reservation.roomId)?.number}</span>
                        <span>${reservation.totalAmount}</span>
                      </div>
                    </div>
                  ))}
                  {getGuestHistory(selectedGuest.id).length === 0 && (
                    <div className="text-center py-8">
                      <ApperIcon name="Calendar" className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No stay history</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preferences */}
            {selectedGuest.preferences && selectedGuest.preferences.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Preferences</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedGuest.preferences.map((pref, idx) => (
                    <span key={idx} className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full">
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Guests;