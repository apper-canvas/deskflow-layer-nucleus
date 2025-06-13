import reservationData from '../mockData/reservation.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ReservationService {
  constructor() {
    this.reservations = [...reservationData];
  }

  async getAll() {
    await delay(300);
    return [...this.reservations];
  }

  async getById(id) {
    await delay(200);
    const reservation = this.reservations.find(r => r.id === id);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    return { ...reservation };
  }

  async create(reservationData) {
    await delay(400);
    const newReservation = {
      ...reservationData,
      id: Date.now().toString()
    };
    this.reservations.push(newReservation);
    return { ...newReservation };
  }

  async update(id, reservationData) {
    await delay(300);
    const index = this.reservations.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Reservation not found');
    }
    this.reservations[index] = { ...this.reservations[index], ...reservationData };
    return { ...this.reservations[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.reservations.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Reservation not found');
    }
    this.reservations.splice(index, 1);
    return true;
  }
}

export default new ReservationService();