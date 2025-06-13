import roomData from '../mockData/room.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class RoomService {
  constructor() {
    this.rooms = [...roomData];
  }

  async getAll() {
    await delay(300);
    return [...this.rooms];
  }

  async getById(id) {
    await delay(200);
    const room = this.rooms.find(r => r.id === id);
    if (!room) {
      throw new Error('Room not found');
    }
    return { ...room };
  }

  async create(roomData) {
    await delay(400);
    const newRoom = {
      ...roomData,
      id: Date.now().toString()
    };
    this.rooms.push(newRoom);
    return { ...newRoom };
  }

  async update(id, roomData) {
    await delay(300);
    const index = this.rooms.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Room not found');
    }
    this.rooms[index] = { ...this.rooms[index], ...roomData };
    return { ...this.rooms[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.rooms.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Room not found');
    }
    this.rooms.splice(index, 1);
    return true;
  }
}

export default new RoomService();