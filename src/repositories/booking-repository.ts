import { prisma } from '@/config/database';

async function findBookings(userId: number) {
  const booking = await prisma.booking.findFirst({
    where: {
      User: {
        id: userId,
      },
    },
    include: {
      Room: true,
    },
  });

  return booking;
}

async function createBooking(roomId: number, userId: number) {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
    include: {
      Room: true,
    },
  });
}

async function updateBooking(roomId: number, bookingId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId,
    },
    include: {
      Room: true,
    },
  });
}

async function findBookingByRoomId(roomId: number) {
  const room = await prisma.room.findFirst({
    where: {
      id: roomId,
    },
    include: {
      Booking: true,
    },
  });

  return room;
}

const bookingRepository = {
  findBookings,
  createBooking,
  updateBooking,
  findBookingByRoomId,
};

export default bookingRepository;
