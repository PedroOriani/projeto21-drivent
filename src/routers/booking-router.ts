import { Router } from 'express';
import { authenticateToken } from '@/middlewares';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken);
bookingRouter.get('/');
bookingRouter.post('/');
bookingRouter.put('/:bookingId');

export { bookingRouter };
