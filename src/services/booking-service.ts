import { forbiddenError, notFoundError } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import bookingRepository from '@/repositories/booking-repository';

async function findBookings(userId: number) {
  const bookings = await bookingRepository.findBookings(userId);

  if (!bookings) throw notFoundError();

  const booking = {
    id: bookings.id,
    Room: bookings.Room,
  };

  return booking;
}

async function createBooking(roomId: number, userId: number) {
  await verifyTicket(userId);
  await verifyRoom(roomId);

  const postBooking = await bookingRepository.createBooking(roomId, userId);

  const booking = {
    bookingId: postBooking.id,
    Room: postBooking.Room,
  };

  return booking;
}

async function updateBooking(roomId: number, userId: number, bookingId: number) {
  const bookingByUser = await bookingRepository.findBookings(userId);

  if (!bookingByUser) throw forbiddenError();
  if (bookingByUser.id !== bookingId) throw forbiddenError();

  await verifyRoom(roomId);

  const booking = await bookingRepository.updateBooking(roomId, bookingId);

  const updateBooking = {
    bookingId: booking.id,
    Room: booking.Room,
  };

  return updateBooking;
}

async function verifyTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status === 'RESERVED')
    throw forbiddenError();
}

async function verifyRoom(roomId: number) {
  const room = await bookingRepository.findBookingByRoomId(roomId);

  if (!room) throw notFoundError();

  if (room.capacity <= room.Booking.length) throw forbiddenError();
}

const bookingService = {
  createBooking,
  updateBooking,
  findBookings,
};

export default bookingService;
