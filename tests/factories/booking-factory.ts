import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  const booking = await prisma.create({
    data: {
      userId,
      roomId,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    },
  });
}
