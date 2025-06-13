const mockUser = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@hotel.com',
  phone: '+1 (555) 123-4567',
  role: 'Manager',
  department: 'Operations',
  joinDate: '2023-01-15',
  avatar: null,
  bio: 'Experienced hotel manager with 10+ years in hospitality industry.',
  address: {
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States'
  },
  preferences: {
    notifications: true,
    emailUpdates: true,
    theme: 'light'
  }
};

export const userService = {
  async getProfile() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...mockUser };
  },

  async updateProfile(profileData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate updating the user data
    Object.assign(mockUser, profileData);
    
    return { ...mockUser };
  }
};