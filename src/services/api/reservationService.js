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
    
    // Calculate payment breakdown with discounts and extras
    const roomCost = parseFloat(reservationData.totalAmount) || 0;
    const additionalFees = parseFloat(reservationData.additionalFees) || 0;
    const discountAmount = parseFloat(reservationData.discountAmount) || 0;
    const taxes = (roomCost + additionalFees - discountAmount) * 0.12;
    const serviceFee = 25.00;
    const subtotal = roomCost + additionalFees - discountAmount;
    const finalTotal = Math.max(0, subtotal + taxes + serviceFee);
    
    const newReservation = {
      ...reservationData,
      id: Date.now().toString(),
      // Ensure roomIds is always an array
      roomIds: Array.isArray(reservationData.roomIds) ? reservationData.roomIds : [reservationData.roomId].filter(Boolean),
      // Add comprehensive payment breakdown
      paymentBreakdown: {
        roomCost: roomCost,
        additionalFees: additionalFees,
        discountAmount: discountAmount,
        subtotal: subtotal,
        taxes: taxes,
        serviceFee: serviceFee,
        total: finalTotal
      },
      // Payment processing fields
      paymentMethod: reservationData.paymentMethod,
      paymentStatus: reservationData.paymentStatus || 'pending',
      paymentDate: reservationData.paymentMethod === 'cash' ? new Date().toISOString() : null,
      // Invoice details
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: new Date().toISOString(),
      totalAmount: finalTotal,
      // Add timeline fields
      timeline: {
        checkIn: reservationData.checkIn,
        checkOut: reservationData.checkOut,
        nights: reservationData.checkIn && reservationData.checkOut ? 
          Math.ceil((new Date(reservationData.checkOut) - new Date(reservationData.checkIn)) / (1000 * 60 * 60 * 24)) : 0
      }
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
    
    // Calculate payment breakdown for updates with discounts and extras
    const roomCost = parseFloat(reservationData.totalAmount) || 0;
    const additionalFees = parseFloat(reservationData.additionalFees) || 0;
    const discountAmount = parseFloat(reservationData.discountAmount) || 0;
    const taxes = (roomCost + additionalFees - discountAmount) * 0.12;
    const serviceFee = 25.00;
    const subtotal = roomCost + additionalFees - discountAmount;
    const finalTotal = Math.max(0, subtotal + taxes + serviceFee);
    
    const updatedData = {
      ...reservationData,
      // Ensure roomIds is always an array for updates
      roomIds: Array.isArray(reservationData.roomIds) ? reservationData.roomIds : [reservationData.roomId].filter(Boolean),
      // Update comprehensive payment breakdown
      paymentBreakdown: {
        roomCost: roomCost,
        additionalFees: additionalFees,
        discountAmount: discountAmount,
        subtotal: subtotal,
        taxes: taxes,
        serviceFee: serviceFee,
        total: finalTotal
      },
      // Update payment processing fields
      paymentMethod: reservationData.paymentMethod,
      paymentStatus: reservationData.paymentStatus || this.reservations[index].paymentStatus,
      paymentDate: reservationData.paymentStatus === 'paid' && !this.reservations[index].paymentDate ? 
        new Date().toISOString() : this.reservations[index].paymentDate,
      totalAmount: finalTotal,
      // Update timeline fields
      timeline: {
        checkIn: reservationData.checkIn,
        checkOut: reservationData.checkOut,
        nights: reservationData.checkIn && reservationData.checkOut ? 
          Math.ceil((new Date(reservationData.checkOut) - new Date(reservationData.checkIn)) / (1000 * 60 * 60 * 24)) : 0
      }
    };
    this.reservations[index] = { ...this.reservations[index], ...updatedData };
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