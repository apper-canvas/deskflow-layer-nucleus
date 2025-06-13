import React from 'react';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';

const AddGuestForm = ({ newGuest, setNewGuest, onSubmit, onClose }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      setNewGuest(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name.split('.')[1]]: value
        }
      }));
    } else {
      setNewGuest(prev => ({ ...prev, [name]: value }));
    }
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

      <FormField label="ID Document Number" id="idDocument">
        <Input type="text" name="idDocument" value={newGuest.idDocument} onChange={handleInputChange} placeholder="Driver's License, Passport, etc." required />
      </FormField>

      <FormField label="Street Address" id="street">
        <Input type="text" name="address.street" value={newGuest.address.street} onChange={handleInputChange} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="City" id="city">
          <Input type="text" name="address.city" value={newGuest.address.city} onChange={handleInputChange} />
        </FormField>
        <FormField label="State" id="state">
          <Input type="text" name="address.state" value={newGuest.address.state} onChange={handleInputChange} />
        </FormField>
      </div>
       {/* Optional: Add Zip Code and Country fields if needed for full address */}

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
          Add Guest
        </Button>
      </div>
    </form>
  );
};

export default AddGuestForm;