import notifications from '../mockData/notification.json';

class NotificationService {
  constructor() {
    this.notifications = [...notifications];

class NotificationService {
  constructor() {
    this.notifications = [...notifications];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.notifications]);
      }, 200);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
          resolve({ ...notification });
        } else {
          reject(new Error('Notification not found'));
        }
      }, 200);
    });
  }

  async create(notification) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newNotification = {
          ...notification,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          read: false
        };
        this.notifications.unshift(newNotification);
        resolve({ ...newNotification });
      }, 300);
    });
  }

  async update(id, updates) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index === -1) {
          reject(new Error('Notification not found'));
          return;
        }
        
        this.notifications[index] = {
          ...this.notifications[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        resolve({ ...this.notifications[index] });
      }, 300);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index === -1) {
          reject(new Error('Notification not found'));
          return;
        }
        
        const deleted = this.notifications.splice(index, 1)[0];
        resolve({ ...deleted });
      }, 200);
    });
  }

  async markAsRead(id) {
    return this.update(id, { read: true });
  }

  async markAllAsRead() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.notifications = this.notifications.map(n => ({ ...n, read: true }));
        resolve([...this.notifications]);
      }, 300);
    });
  }

  async getUnreadCount() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const count = this.notifications.filter(n => !n.read).length;
        resolve(count);
      }, 100);
    });
  }
}

export default new NotificationService();