import { notFoundError } from "@/errors";
import { AuthenticatedRequest } from "@/middlewares";
import { InputBookingBody } from "@/protocols";
import bookingService from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";

async function findBookings(req: AuthenticatedRequest, res: Response) {
    const { userId } = req.body;

    const bookings = await bookingService.findBookings(userId);

    res.status(httpStatus.OK).send(bookings)
}

async function createBooking(req: AuthenticatedRequest, res: Response) {
    const { roomId } = req.body as InputBookingBody
    const { userId } = req;
    if (!roomId) throw notFoundError();

    const booking = await bookingService.createBooking(roomId, userId) 

    res.status(httpStatus.OK).send(booking)
}

async function updateBooking(req: AuthenticatedRequest, res: Response) {
    const { roomId } = req.body as InputBookingBody
    const { userId } = req;
    const bookingId= Number(req.params.bookingId)

    if(!roomId) throw notFoundError();

    const booking = await bookingService.updateBooking(roomId, userId, bookingId) 

    res.status(httpStatus.OK).send(booking)
}

const bookingController = {
    createBooking,
    updateBooking,
    findBookings
}

export default bookingController