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
    <form onSubmit={onSubmit} className="space-y-6">
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

      {/* Booking Timeline Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Timeline</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField label="Check-in Date" required>
            <Input
              type="date"
              name="checkIn"
              value={newReservation.checkIn}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </FormField>
          
          <FormField label="Check-out Date" required>
            <Input
              type="date"
              name="checkOut"
              value={newReservation.checkOut}
              onChange={handleInputChange}
              min={newReservation.checkIn || new Date().toISOString().split('T')[0]}
              required
            />
          </FormField>
        </div>

        {/* Timeline Visualization */}
        {newReservation.checkIn && newReservation.checkOut && (
          <div className="bg-white p-3 rounded border">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Check-in: {new Date(newReservation.checkIn).toLocaleDateString()}</span>
              <span>Check-out: {new Date(newReservation.checkOut).toLocaleDateString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
            <div className="text-center text-sm text-gray-500 mt-2">
              {Math.ceil((new Date(newReservation.checkOut) - new Date(newReservation.checkIn)) / (1000 * 60 * 60 * 24))} nights
            </div>
          </div>
        )}
      </div>

      {/* Payment Breakdown Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Breakdown</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Room Cost ({getSelectedRooms().length} room{getSelectedRooms().length !== 1 ? 's' : ''})</span>
            <span className="font-medium">${getTotalPrice()}</span>
          </div>
          
          <FormField label="Additional Fees" className="mb-0">
            <Input
              type="number"
              name="additionalFees"
              value={newReservation.additionalFees || 0}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </FormField>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Taxes (12%)</span>
            <span className="font-medium">${(getTotalPrice() * 0.12).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service Fee</span>
            <span className="font-medium">$25.00</span>
          </div>
          
          <div className="border-t pt-3">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span className="text-primary">
                ${(getTotalPrice() + (parseFloat(newReservation.additionalFees) || 0) + (getTotalPrice() * 0.12) + 25).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <FormField label="Special Requests" className="mb-0">
        <TextArea
          name="specialRequests"
          value={newReservation.specialRequests || ''}
          onChange={handleInputChange}
          placeholder="Any special requests or notes..."
          rows={3}
        />
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