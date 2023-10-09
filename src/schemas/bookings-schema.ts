import Joi from 'joi';
import { InputBookingBody } from '@/protocols';

const bookingSchema = Joi.object<InputBookingBody>({
  roomId: Joi.number().required(),
});

export default bookingSchema;
