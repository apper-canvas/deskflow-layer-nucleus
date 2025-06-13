import React from 'react';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';
import ApperIcon from '@/components/ApperIcon';

const EditProfileForm = ({ user, setUser, onSubmit, onCancel, loading }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested object properties (e.g., address.street)
      const [parent, child] = name.split('.');
      setUser(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setUser(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Personal Information
          </h3>
          
          <FormField label="First Name" id="firstName" required>
            <Input
              id="firstName"
              name="firstName"
              value={user.firstName || ''}
              onChange={handleInputChange}
              required
            />
          </FormField>

          <FormField label="Last Name" id="lastName" required>
            <Input
              id="lastName"
              name="lastName"
              value={user.lastName || ''}
              onChange={handleInputChange}
              required
            />
          </FormField>

          <FormField label="Email" id="email" required>
            <Input
              id="email"
              name="email"
              type="email"
              value={user.email || ''}
              onChange={handleInputChange}
              required
            />
          </FormField>

          <FormField label="Phone" id="phone">
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={user.phone || ''}
              onChange={handleInputChange}
            />
          </FormField>

          <FormField label="Bio" id="bio">
            <TextArea
              id="bio"
              name="bio"
              value={user.bio || ''}
              onChange={handleInputChange}
              rows={3}
              placeholder="Tell us about yourself..."
            />
          </FormField>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Address Information
          </h3>
          
          <FormField label="Street Address" id="address.street">
            <Input
              id="address.street"
              name="address.street"
              value={user.address?.street || ''}
              onChange={handleInputChange}
            />
          </FormField>

          <FormField label="City" id="address.city">
            <Input
              id="address.city"
              name="address.city"
              value={user.address?.city || ''}
              onChange={handleInputChange}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="State" id="address.state">
              <Input
                id="address.state"
                name="address.state"
                value={user.address?.state || ''}
                onChange={handleInputChange}
              />
            </FormField>

            <FormField label="ZIP Code" id="address.zipCode">
              <Input
                id="address.zipCode"
                name="address.zipCode"
                value={user.address?.zipCode || ''}
                onChange={handleInputChange}
              />
            </FormField>
          </div>

          <FormField label="Country" id="address.country">
            <Input
              id="address.country"
              name="address.country"
              value={user.address?.country || ''}
              onChange={handleInputChange}
            />
          </FormField>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;