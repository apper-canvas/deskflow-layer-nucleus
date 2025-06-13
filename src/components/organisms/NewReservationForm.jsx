import React from 'react';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';

const NewReservationForm = ({ newReservation, setNewReservation, guests, rooms, onSubmit, onClose }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReservation(prev => ({ ...prev, [name]: value }));
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

      <FormField label="Room" id="roomId">
        <Select name="roomId" value={newReservation.roomId} onChange={handleInputChange} required>
          <option value="">Select a room</option>
          {rooms.filter(room => room.status === 'available').map(room => (
            <option key={room.id} value={room.id}>
              Room {room.number} - {room.type} (${room.price}/night)
            </option>
          ))}
        </Select>
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
          Create Reservation
        </Button>
      </div>
    </form>
  );
};

export default NewReservationForm;