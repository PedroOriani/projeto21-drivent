import { InputBookingBody } from "@/protocols";
import Joi from "joi";

const bookingSchema = Joi.object<InputBookingBody>({
    roomId: Joi.number().required()
})

export default bookingSchema;