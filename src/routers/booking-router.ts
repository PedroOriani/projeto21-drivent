import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import bookingController from '@/controllers/booking-controller';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken);
bookingRouter.get('/', bookingController.findBookings);
bookingRouter.post('/', bookingController.createBooking);
bookingRouter.put('/:bookingId', bookingController.updateBooking);

export { bookingRouter };
