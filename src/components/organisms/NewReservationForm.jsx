import React from 'react';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';

const NewReservationForm = ({ newReservation, setNewReservation, guests, rooms, onSubmit, onClose, isEdit = false }) => {
const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReservation(prev => ({ ...prev, [name]: value }));
  };

  const handleRoomSelection = (roomId) => {
    setNewReservation(prev => {
      const currentRoomIds = prev.roomIds || [];
      const isSelected = currentRoomIds.includes(roomId);
      
      const updatedRoomIds = isSelected
        ? currentRoomIds.filter(id => id !== roomId)
        : [...currentRoomIds, roomId];
      
      return { ...prev, roomIds: updatedRoomIds };
    });
  };

  const getSelectedRooms = () => {
    const roomIds = newReservation.roomIds || [];
    return rooms.filter(room => roomIds.includes(room.id));
  };

  const getTotalPrice = () => {
    return getSelectedRooms().reduce((total, room) => total + room.price, 0);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField label="Guest" id="guestId">
        <Select name="guestId" value={newReservation.guestId} onChange={handleInputChange} required>
          <option value="">Select a guest</option>
          {guests.map(guest => (
            <option key={guest.id} value={guest.id}>
              {guest.firstName} {guest.lastName}
            </option>
          ))}
        </Select>
      </FormField>

<FormField label="Select Rooms" id="rooms">
        <div className="space-y-3">
          {rooms.filter(room => room.status === 'available').map(room => (
            <div key={room.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                id={`room-${room.id}`}
                checked={(newReservation.roomIds || []).includes(room.id)}
                onChange={() => handleRoomSelection(room.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`room-${room.id}`} className="ml-3 flex-1 cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">Room {room.number}</span>
                    <span className="ml-2 text-sm text-gray-500">{room.type}</span>
                  </div>
                  <span className="font-semibold text-gray-900">${room.price}/night</span>
                </div>
              </label>
            </div>
          ))}
        </div>
        
        {getSelectedRooms().length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-900">
                {getSelectedRooms().length} room{getSelectedRooms().length > 1 ? 's' : ''} selected
              </span>
              <span className="text-lg font-bold text-blue-900">
                Total: ${getTotalPrice()}/night
              </span>
            </div>
            <div className="mt-2 text-xs text-blue-700">
              {getSelectedRooms().map(room => `Room ${room.number}`).join(', ')}
            </div>
          </div>
        )}
        
        {(!newReservation.roomIds || newReservation.roomIds.length === 0) && (
          <p className="mt-2 text-sm text-red-600">Please select at least one room</p>
        )}
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Check-In Date" id="checkIn">
          <Input type="date" name="checkIn" value={newReservation.checkIn} onChange={handleInputChange} required />
        </FormField>
        <FormField label="Check-Out Date" id="checkOut">
          <Input type="date" name="checkOut" value={newReservation.checkOut} onChange={handleInputChange} required />
        </FormField>
      </div>

      <FormField label="Notes (Optional)" id="notes">
        <TextArea name="notes" value={newReservation.notes} onChange={handleInputChange} placeholder="Any special requests or notes..." />
      </FormField>

      <div className="flex space-x-3 pt-4">
        <Button
          type="button"
          onClick={onClose}
          className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
type="submit"
          className="flex-1 bg-primary text-white hover:bg-primary/90"
        >
          {isEdit ? 'Update Reservation' : 'Create Reservation'}
        </Button>
      </div>
    </form>
  );
};

export default NewReservationForm;