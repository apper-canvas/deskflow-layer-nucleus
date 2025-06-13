import guestData from '../mockData/guest.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GuestService {
  constructor() {
    this.guests = [...guestData];
  }

  async getAll() {
    await delay(300);
    return [...this.guests];
  }

  async getById(id) {
    await delay(200);
    const guest = this.guests.find(g => g.id === id);
    if (!guest) {
      throw new Error('Guest not found');
    }
    return { ...guest };
  }

  async create(guestData) {
    await delay(400);
    const newGuest = {
      ...guestData,
      id: Date.now().toString()
    };
    this.guests.push(newGuest);
    return { ...newGuest };
  }

  async update(id, guestData) {
    await delay(300);
    const index = this.guests.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Guest not found');
    }
    this.guests[index] = { ...this.guests[index], ...guestData };
    return { ...this.guests[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.guests.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Guest not found');
    }
    this.guests.splice(index, 1);
    return true;
  }
}

export const guestService = new GuestService();
export default new GuestService();