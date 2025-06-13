import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import StatusTag from '@/components/atoms/StatusTag';

const ReservationTable = ({ reservations, guests, rooms, handleStatusChange, onNewReservationClick, searchTerm, statusFilter }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {reservations.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <Text as="h3" className="text-lg font-medium text-gray-900 mb-2">No Reservations Found</Text>
          <Text as="p" className="text-gray-500 mb-4">
            {searchTerm || statusFilter !== 'all'
              ? 'No reservations match your search criteria'
              : 'Get started by creating your first reservation'
            }
          </Text>
          <Button
            onClick={onNewReservationClick}
            className="px-4 py-2 bg-primary text-white hover:bg-primary/90"
          >
            Create Reservation
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-In
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-Out
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation, index) => {
                const guest = guests.find(g => g.id === reservation.guestId);
                const room = rooms.find(r => r.id === reservation.roomId);

                return (
                  <motion.tr
                    key={reservation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                          <Text as="span" className="text-xs font-medium text-primary">
                            {guest?.firstName?.[0]}{guest?.lastName?.[0]}
                          </Text>
                        </div>
                        <div>
                          <Text as="div" className="text-sm font-medium text-gray-900">
                            {guest?.firstName} {guest?.lastName}
                          </Text>
                          <Text as="div" className="text-sm text-gray-500">{guest?.phone}</Text>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text as="div" className="text-sm font-medium text-gray-900">Room {room?.number}</Text>
                      <Text as="div" className="text-sm text-gray-500">{room?.type}</Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(reservation.checkIn).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(reservation.checkOut).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusTag status={reservation.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${reservation.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {reservation.status === 'confirmed' && (
                          <Button
                            onClick={() => handleStatusChange(reservation.id, 'checked-in')}
                            className="text-primary hover:text-primary/80 font-medium p-0 bg-transparent hover:bg-transparent"
                          >
                            Check In
                          </Button>
                        )}
                        {reservation.status === 'checked-in' && (
                          <Button
                            onClick={() => handleStatusChange(reservation.id, 'checked-out')}
                            className="text-warning hover:text-warning/80 font-medium p-0 bg-transparent hover:bg-transparent"
                          >
                            Check Out
                          </Button>
                        )}
                        {reservation.status === 'confirmed' && (
                          <Button
                            onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                            className="text-error hover:text-error/80 font-medium p-0 bg-transparent hover:bg-transparent"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReservationTable;