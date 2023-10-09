import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken);
bookingRouter.get('/', );
bookingRouter.post('/', );
bookingRouter.put('/:bookingId', );

export { bookingRouter };