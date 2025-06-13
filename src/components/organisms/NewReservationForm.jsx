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

const handleRoomSelection = (selectedIds) => {
    // selectedIds is now an array from the updated Select component
    setNewReservation(prev => ({
      ...prev,
      roomIds: selectedIds || []
    }));
  };

const getSelectedRooms = () => {
    const roomIds = newReservation.roomIds || [];
    return rooms.filter(room => roomIds.includes(room.id));
  };

  const getTotalPrice = () => {
    const basePrice = getSelectedRooms().reduce((total, room) => total + room.price, 0);
    const extraCharges = parseFloat(newReservation.extraCharges) || 0;
    const discountAmount = parseFloat(newReservation.discountAmount) || 0;
    return Math.max(0, basePrice + extraCharges - discountAmount);
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
        <Select
          multiple
          value={newReservation.roomIds || []}
          onChange={handleRoomSelection}
          className="w-full"
        >
          <option value="">Choose rooms...</option>
          {rooms.filter(room => room.status === 'available').map(room => (
            <option key={room.id} value={room.id}>
              Room {room.number} - {room.type} (${room.price}/night)
            </option>
          ))}
        </Select>
        
{getSelectedRooms().length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-blue-900">
                {getSelectedRooms().length} room{getSelectedRooms().length > 1 ? 's' : ''} selected
              </span>
              <span className="text-lg font-bold text-blue-900">
                Total: ${getTotalPrice()}/night
              </span>
            </div>
            <div className="text-xs text-blue-700 mb-3">
              {getSelectedRooms().map(room => `Room ${room.number}`).join(', ')}
            </div>
            
            {/* Payment Method Selection */}
            <div className="border-t pt-3">
              <FormField label="Payment Method" required>
                <Select
                  name="paymentMethod"
                  value={newReservation.paymentMethod || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select payment method</option>
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                </Select>
              </FormField>
            </div>
          </div>
        )}
        
        {(!newReservation.roomIds || newReservation.roomIds.length === 0) && (
          <p className="mt-2 text-sm text-red-600">Please select at least one room</p>
        )}
</FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Billing and Charges Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Discount Amount ($)">
          <Input
            type="number"
            name="discountAmount"
            value={newReservation.discountAmount || ''}
            onChange={handleInputChange}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </FormField>
        
        <FormField label="Extra Charges ($)">
          <Input
            type="number"
            name="extraCharges"
            value={newReservation.extraCharges || ''}
            onChange={handleInputChange}
            placeholder="Room service, mini bar, etc."
            min="0"
            step="0.01"
          />
        </FormField>
</div>

      <FormField label="Total Amount ($)">
        <Input
          type="text"
          value={`$${getTotalPrice().toFixed(2)}`}
          readOnly
          className="bg-gray-50 font-semibold text-gray-900"
          placeholder="Calculated automatically"
        />
      </FormField>

      <FormField label="Extra Charges Description">
        <TextArea
          name="extraChargesDescription"
          value={newReservation.extraChargesDescription || ''}
          onChange={handleInputChange}
          placeholder="Describe additional charges (room service, mini bar, etc.)"
          rows={2}
        />
      </FormField>

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