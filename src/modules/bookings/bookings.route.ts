import express from "express";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";
import { bookingsController } from "./bookings.controller";

const router = express.Router();

router.post(
  "/",
  auth(Roles.admin, Roles.customer),
  bookingsController.createBooking
);

router.get(
  "/",
  auth(Roles.admin, Roles.customer),
  bookingsController.getBookings
);

router.put(
  "/:bookingId",
  auth(Roles.admin, Roles.customer),
  bookingsController.updateBooking
);

export const bookingsRouter = router;
