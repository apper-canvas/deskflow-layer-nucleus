import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Spinner from '@/components/atoms/Spinner';
import EditProfileForm from '@/components/organisms/EditProfileForm';
import { userService } from '@/services';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profile = await userService.getProfile();
      setUser(profile);
      setEditData(profile);
    } catch (err) {
      setError('Failed to load profile');
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...user });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...user });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedUser = await userService.updateProfile(editData);
      setUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error" />
        <Text className="text-lg font-medium text-gray-900">Failed to load profile</Text>
        <Button onClick={loadProfile} variant="primary">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Text className="text-2xl font-bold text-primary">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </Text>
              </div>
              <div>
                <Text className="text-2xl font-bold text-white">
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text className="text-primary-light">
                  {user?.role} • {user?.department}
                </Text>
              </div>
            </div>
            {!isEditing && (
              <Button
                onClick={handleEdit}
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-50"
              >
                <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isEditing ? (
            <EditProfileForm
              user={editData}
              setUser={setEditData}
              onSubmit={handleSave}
              onCancel={handleCancel}
              loading={loading}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <Text className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Contact Information
                </Text>
                <div className="space-y-3">
                  <div>
                    <Text className="text-sm font-medium text-gray-500">Email</Text>
                    <Text className="text-gray-900">{user?.email}</Text>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-gray-500">Phone</Text>
                    <Text className="text-gray-900">{user?.phone}</Text>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-gray-500">Address</Text>
                    <Text className="text-gray-900">
                      {user?.address?.street}<br />
                      {user?.address?.city}, {user?.address?.state} {user?.address?.zipCode}<br />
                      {user?.address?.country}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="space-y-4">
                <Text className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Work Information
                </Text>
                <div className="space-y-3">
                  <div>
                    <Text className="text-sm font-medium text-gray-500">Department</Text>
                    <Text className="text-gray-900">{user?.department}</Text>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-gray-500">Join Date</Text>
                    <Text className="text-gray-900">
                      {new Date(user?.joinDate).toLocaleDateString()}
                    </Text>
                  </div>
                  <div>
                    <Text className="text-sm font-medium text-gray-500">Bio</Text>
                    <Text className="text-gray-900">{user?.bio}</Text>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;