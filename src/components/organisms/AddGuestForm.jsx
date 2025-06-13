import React from 'react';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';

const AddGuestForm = ({ newGuest, setNewGuest, onSubmit, onClose, isEdit = false }) => {
const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGuest(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="First Name" id="firstName">
          <Input type="text" name="firstName" value={newGuest.firstName} onChange={handleInputChange} required />
        </FormField>
        <FormField label="Last Name" id="lastName">
          <Input type="text" name="lastName" value={newGuest.lastName} onChange={handleInputChange} required />
        </FormField>
      </div>

      <FormField label="Email Address" id="email">
        <Input type="email" name="email" value={newGuest.email} onChange={handleInputChange} required />
      </FormField>

      <FormField label="Phone Number" id="phone">
        <Input type="tel" name="phone" value={newGuest.phone} onChange={handleInputChange} required />
      </FormField>

<FormField label="Government ID Proof" id="governmentIdProof">
        <Input type="text" name="governmentIdProof" value={newGuest.governmentIdProof} onChange={handleInputChange} placeholder="e.g., Driver's License, Passport, etc." required />
      </FormField>

      <FormField label="Address" id="address">
        <Input type="text" name="address" value={newGuest.address} onChange={handleInputChange} placeholder="Full address" />
      </FormField>

      <FormField label="Nationality" id="nationality">
        <Input type="text" name="nationality" value={newGuest.nationality} onChange={handleInputChange} placeholder="e.g., American, Canadian, etc." />
      </FormField>

      <FormField label="Guest Type" id="guestType">
        <select name="guestType" value={newGuest.guestType} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          <option value="individual">Individual</option>
          <option value="business">Business</option>
          <option value="group">Group</option>
        </select>
      </FormField>

      <FormField label="Special Preferences" id="specialPreferences">
        <TextArea name="specialPreferences" value={newGuest.specialPreferences} onChange={handleInputChange} placeholder="Any special requests or preferences..." rows={3} />
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
          {isEdit ? 'Update Guest' : 'Add Guest'}
        </Button>
      </div>
    </form>
  );
};

export default AddGuestForm;