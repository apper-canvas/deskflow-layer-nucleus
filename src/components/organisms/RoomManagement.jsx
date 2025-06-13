import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import TextArea from '@/components/atoms/TextArea';
import Spinner from '@/components/atoms/Spinner';
import Modal from '@/components/molecules/Modal';
import FormField from '@/components/molecules/FormField';
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [checkInData, setCheckInData] = useState({
    guestId: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    notes: ''
  });
  const [roomForm, setRoomForm] = useState({
    number: '',
    type: 'standard',
    price: '',
    capacity: '',
    amenities: [],
    status: 'available',
    description: ''
  });

  const roomTypes = [
    { value: 'standard', label: 'Standard Room' },
    { value: 'deluxe', label: 'Deluxe Room' },
    { value: 'suite', label: 'Suite' },
    { value: 'executive', label: 'Executive Room' }
  ];

  const amenityOptions = [
    'Wi-Fi', 'Air Conditioning', 'Mini Bar', 'Safe', 'Balcony', 
    'Ocean View', 'City View', 'Jacuzzi', 'Kitchen', 'Living Area'
  ];

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

  const resetRoomForm = () => {
    setRoomForm({
      number: '',
      type: 'standard',
      price: '',
      capacity: '',
      amenities: [],
      status: 'available',
      description: ''
    });
  };

  const handleAddRoom = () => {
    resetRoomForm();
    setShowAddModal(true);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({
      number: room.number,
      type: room.type,
      price: room.price.toString(),
      capacity: room.capacity.toString(),
      amenities: room.amenities || [],
      status: room.status,
      description: room.description || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteRoom = (room) => {
    setRoomToDelete(room);
    setShowDeleteModal(true);
  };

  const handleRoomFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!roomForm.number || !roomForm.price || !roomForm.capacity) {
      toast.error('Please fill in all required fields');
      return;
    }

    const roomData = {
      ...roomForm,
      price: parseFloat(roomForm.price),
      capacity: parseInt(roomForm.capacity),
      amenities: roomForm.amenities
    };

    try {
      if (editingRoom) {
        const updatedRoom = await roomService.update(editingRoom.id, roomData);
        setRooms(rooms.map(r => r.id === editingRoom.id ? updatedRoom : r));
        toast.success(`Room ${roomForm.number} updated successfully`);
        setShowEditModal(false);
        setEditingRoom(null);
      } else {
        const newRoom = await roomService.create(roomData);
        setRooms([...rooms, newRoom]);
        toast.success(`Room ${roomForm.number} added successfully`);
        setShowAddModal(false);
      }
      resetRoomForm();
    } catch (err) {
      toast.error(editingRoom ? 'Failed to update room' : 'Failed to add room');
    }
  };

  const confirmDeleteRoom = async () => {
    try {
      await roomService.delete(roomToDelete.id);
      setRooms(rooms.filter(r => r.id !== roomToDelete.id));
      toast.success(`Room ${roomToDelete.number} deleted successfully`);
      setShowDeleteModal(false);
      setRoomToDelete(null);
    } catch (err) {
      toast.error('Failed to delete room');
    }
  };

  const handleAmenityToggle = (amenity) => {
    const updatedAmenities = roomForm.amenities.includes(amenity)
      ? roomForm.amenities.filter(a => a !== amenity)
      : [...roomForm.amenities, amenity];
    
    setRoomForm({ ...roomForm, amenities: updatedAmenities });
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Text as="h2" className="text-2xl font-heading font-semibold text-gray-900 mb-2">Room Management</Text>
          <Text as="p" className="text-gray-600">Manage room availability and guest check-ins</Text>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleAddRoom}
            className="bg-primary text-white hover:bg-primary/90"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Room
          </Button>
        </div>
      </div>

      <RoomGrid
        rooms={rooms}
        guests={guests}
        onQuickCheckIn={handleQuickCheckIn}
        onStatusChange={handleRoomStatusChange}
        onEditRoom={handleEditRoom}
        onDeleteRoom={handleDeleteRoom}
      />

      {/* Check-In Modal */}
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

      {/* Add/Edit Room Modal */}
      {(showAddModal || showEditModal) && (
        <Modal 
          title={editingRoom ? `Edit Room ${editingRoom.number}` : 'Add New Room'} 
          onClose={() => {
            showAddModal ? setShowAddModal(false) : setShowEditModal(false);
            resetRoomForm();
            setEditingRoom(null);
          }}
          className="max-w-2xl"
        >
          <form onSubmit={handleRoomFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Room Number" required>
                <Input
                  type="text"
                  value={roomForm.number}
                  onChange={(e) => setRoomForm({ ...roomForm, number: e.target.value })}
                  placeholder="e.g., 101"
                  required
                />
              </FormField>

              <FormField label="Room Type" required>
                <Select
                  value={roomForm.type}
                  onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                  options={roomTypes}
                />
              </FormField>

              <FormField label="Price per Night" required>
                <Input
                  type="number"
                  step="0.01"
                  value={roomForm.price}
                  onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </FormField>

              <FormField label="Capacity (Guests)" required>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={roomForm.capacity}
                  onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                  placeholder="2"
                  required
                />
              </FormField>

              <FormField label="Status" className="md:col-span-2">
                <Select
                  value={roomForm.status}
                  onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                  options={[
                    { value: 'available', label: 'Available' },
                    { value: 'occupied', label: 'Occupied' },
                    { value: 'maintenance', label: 'Maintenance' },
                    { value: 'cleaning', label: 'Cleaning' }
                  ]}
                />
              </FormField>
            </div>

            <FormField label="Amenities">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {amenityOptions.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={roomForm.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label="Description">
              <TextArea
                value={roomForm.description}
                onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                placeholder="Optional room description..."
                rows={3}
              />
            </FormField>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  showAddModal ? setShowAddModal(false) : setShowEditModal(false);
                  resetRoomForm();
                  setEditingRoom(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary/90"
              >
                {editingRoom ? 'Update' : 'Add'} Room
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && roomToDelete && (
        <Modal 
          title="Delete Room" 
          onClose={() => {
            setShowDeleteModal(false);
            setRoomToDelete(null);
          }}
          className="max-w-md"
        >
          <div className="py-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <ApperIcon name="Trash2" className="w-6 h-6 text-red-600" />
            </div>
            <Text as="h3" className="text-lg font-medium text-gray-900 text-center mb-2">
              Delete Room {roomToDelete.number}?
            </Text>
            <Text as="p" className="text-gray-500 text-center mb-6">
              This action cannot be undone. The room will be permanently removed from the system.
            </Text>
            <div className="flex justify-center space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setRoomToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteRoom}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete Room
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RoomManagement;