import { Request, Response } from "express";
import { bookingServices } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;
    const booking = await bookingServices.createBookingService(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date
    );
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingServices.getBookingsFromDB(
      req.user?.id,
      req.user?.role
    );

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);

    if (isNaN(bookingId)) {
      return res.status(400).json({ message: "Invalid bookingId" });
    }

    const result = await bookingServices.updateBookingFromDB(
      bookingId,
      req.user?.id,
      req.user?.role
    );

    res.status(200).json({
      success: true,
      message: result?.message,
      data: result?.booking,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingsController = {
  createBooking,
  getBookings,
  updateBooking,
};
