import faker from '@faker-js/faker';
import { Address, Booking, Enrollment, Room, Ticket, TicketStatus, TicketType } from '@prisma/client';
import bookingRepository from '@/repositories/booking-repository';
import bookingService from '@/services/booking-service';
import { enrollmentRepository, ticketsRepository } from '@/repositories';

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

describe('POST /booking', () => {
  it('should return 404 NOT FOUND when there is no room', async () => {
    const enrollmentMock: Enrollment & {
      Address: Address[];
    } = {
      id: 1,
      name: faker.name.firstName(),
      cpf: '11111111111',
      birthday: new Date(),
      phone: '1111111111',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.cityName(),
          addressDetail: faker.address.streetAddress(),
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    const ticketUserMock: Ticket & {
      TicketType: TicketType;
    } = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: enrollmentMock.id,
      status: TicketStatus.PAID,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.lastName(),
        price: 1,
        isRemote: false,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const bookingMock = {
      userId: enrollmentMock.userId,
      roomId: 1,
    };

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(enrollmentMock);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(ticketUserMock);
    jest.spyOn(bookingRepository, 'findBookingByRoomId').mockResolvedValueOnce(null);

    const response = bookingService.createBooking(bookingMock.userId, bookingMock.roomId);

    expect(response).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should return 403 FORBIDDEN when the room is full', async () => {
    const enrollmentMock: Enrollment & {
      Address: Address[];
    } = {
      id: 1,
      name: faker.name.firstName(),
      cpf: '11111111111',
      birthday: new Date(),
      phone: '1111111111',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.cityName(),
          addressDetail: faker.address.streetAddress(),
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    const ticketUserMock: Ticket & {
      TicketType: TicketType;
    } = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: enrollmentMock.id,
      status: TicketStatus.PAID,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.lastName(),
        price: 1,
        isRemote: false,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const roomMock: Room & {
      Booking: Booking[];
    } = {
      id: 1,
      name: faker.name.firstName(),
      capacity: 0,
      hotelId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Booking: [],
    };

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(enrollmentMock);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(ticketUserMock);
    jest.spyOn(bookingRepository, 'findBookingByRoomId').mockResolvedValueOnce(roomMock);

    const response = bookingService.createBooking(enrollmentMock.userId, roomMock.id);

    expect(response).rejects.toEqual({
      name: 'ForbiddenError',
      message: 'error 403',
    });
  });

  it('should create a booking', async () => {
    const enrollmentMock: Enrollment & {
      Address: Address[];
    } = {
      id: 1,
      name: faker.name.firstName(),
      cpf: '11111111111',
      birthday: new Date(),
      phone: '1111111111',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Address: [
        {
          id: 1,
          cep: faker.address.zipCode(),
          street: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          number: faker.address.buildingNumber(),
          neighborhood: faker.address.cityName(),
          addressDetail: faker.address.streetAddress(),
          enrollmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    const ticketUserMock: Ticket & {
      TicketType: TicketType;
    } = {
      id: 1,
      ticketTypeId: 1,
      enrollmentId: enrollmentMock.id,
      status: TicketStatus.PAID,
      createdAt: new Date(),
      updatedAt: new Date(),
      TicketType: {
        id: 1,
        name: faker.name.lastName(),
        price: 1,
        isRemote: false,
        includesHotel: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const roomMock: Room & {
      Booking: Booking[];
    } = {
      id: 1,
      name: faker.name.firstName(),
      capacity: 4,
      hotelId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Booking: [],
    };

    const bookingMock: Booking & {
      Room: Room;
    } = {
      id: 1,
      userId: enrollmentMock.userId,
      roomId: roomMock.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      Room: {
        id: roomMock.id,
        name: roomMock.name,
        capacity: roomMock.capacity,
        hotelId: roomMock.hotelId,
        createdAt: roomMock.createdAt,
        updatedAt: roomMock.updatedAt,
      },
    };

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(enrollmentMock);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(ticketUserMock);
    jest.spyOn(bookingRepository, 'findBookingByRoomId').mockResolvedValueOnce(roomMock);
    jest.spyOn(bookingRepository, 'createBooking').mockResolvedValueOnce(bookingMock);

    const response = await bookingService.createBooking(enrollmentMock.userId, roomMock.id);

    expect(response).toEqual({
      bookingId: bookingMock.id,
      Room: bookingMock.Room,
    });
  });
});

describe('POST /booking', () => {
  it('should update a booking', async () => {
    const bookingMock: Booking & {
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
        capacity: 2,
        hotelId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const roomMock: Room & {
      Booking: Booking[];
    } = {
      id: 1,
      name: faker.name.firstName(),
      capacity: 4,
      hotelId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      Booking: [
        {
          id: bookingMock.id,
          userId: bookingMock.userId,
          roomId: bookingMock.Room.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };
    jest.spyOn(bookingRepository, 'findBookings').mockResolvedValueOnce(bookingMock);
    jest.spyOn(bookingRepository, 'findBookingByRoomId').mockResolvedValueOnce(roomMock);
    jest.spyOn(bookingRepository, 'updateBooking').mockResolvedValueOnce(bookingMock);

    const updateMock = {
      userId: bookingMock.userId,
      bookingId: bookingMock.id,
      roomId: bookingMock.roomId,
    };

    const response = await bookingService.updateBooking(updateMock.userId, updateMock.bookingId, updateMock.roomId);

    expect(response).toEqual({
      bookingId: expect.any(Number),
      Room: {
        id: expect.any(Number),
        name: expect.any(String),
        capacity: expect.any(Number),
        hotelId: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});
