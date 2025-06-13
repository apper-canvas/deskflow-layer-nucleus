import React from 'react';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';

const CheckInForm = ({ checkInData, setCheckInData, guests, selectedRoom, onSubmit, onClose }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckInData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField label="Guest" id="guestId">
        <Select name="guestId" value={checkInData.guestId} onChange={handleInputChange} required>
          <option value="">Select a guest</option>
          {guests.map(guest => (
            <option key={guest.id} value={guest.id}>
              {guest.firstName} {guest.lastName}
            </option>
          ))}
        </Select>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Check-In Date" id="checkInDate">
          <Input type="date" name="checkIn" value={checkInData.checkIn} onChange={handleInputChange} required />
        </FormField>
        <FormField label="Check-Out Date" id="checkOutDate">
          <Input type="date" name="checkOut" value={checkInData.checkOut} onChange={handleInputChange} required />
        </FormField>
      </div>

      <FormField label="Notes (Optional)" id="notes">
        <TextArea name="notes" value={checkInData.notes} onChange={handleInputChange} placeholder="Any special requests or notes..." />
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
          Check In Guest
        </Button>
      </div>
    </form>
  );
};

export default CheckInForm;