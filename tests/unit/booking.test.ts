import faker from '@faker-js/faker';
import { Address, Booking, Enrollment, Room, Ticket, TicketStatus, TicketType } from '@prisma/client';
import bookingRepository from '@/repositories/booking-repository';
import bookingService from '@/services/booking-service';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /booking', () => {
  it('should return 404 NOT FOUND when there is no booking', async () => {
    jest.spyOn(bookingRepository, 'findBookings').mockResolvedValueOnce(null);

    const booking = bookingService.findBookings(1);

    expect(booking).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should return 200 and the booking data', async () => {
    const bookingInput: Booking & {
      Room: Room;
    } = {
      id: 1,
      userId: 1,
      roomId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Room: {
        id: 1,
        name: faker.name.firstName(),
        capacity: 1,
        hotelId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    jest.spyOn(bookingRepository, 'findBookings').mockResolvedValueOnce(bookingInput);

    const booking = await bookingService.findBookings(bookingInput.userId);

    expect(booking).toEqual({
      id: bookingInput.id,
      Room: {
        id: bookingInput.Room.id,
        name: bookingInput.Room.name,
        capacity: bookingInput.Room.capacity,
        hotelId: bookingInput.Room.hotelId,
        createdAt: bookingInput.Room.createdAt,
        updatedAt: bookingInput.Room.updatedAt,
      },
    });
  });
});
