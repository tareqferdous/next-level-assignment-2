import { pool } from "../../config/db";

const createBookingService = async (
  customer_id: number,
  vehicle_id: number,
  rent_start_date: string,
  rent_end_date: string
) => {
  const userRes = await pool.query("SELECT * FROM users WHERE id=$1", [
    customer_id,
  ]);

  if (userRes.rows.length === 0) {
    throw new Error("User not found");
  }

  const vehicleRes = await pool.query("SELECT * FROM vehicles WHERE id=$1", [
    vehicle_id,
  ]);
  if (vehicleRes.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleRes.rows[0];
  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle not available");
  }

  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);
  if (endDate <= startDate) {
    throw new Error("End date must be after start date");
  }

  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = days * vehicle.daily_rent_price;

  const bookingRes = await pool.query(
    `INSERT INTO bookings
     (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, 'active')
     RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );
  return bookingRes.rows[0];
};

const getBookingsFromDB = async (
  userId: number,
  role: "admin" | "customer"
) => {
  if (role === "admin") {
    const adminBookings = await pool.query("SELECT * FROM bookings ");
    return adminBookings.rows;
  }

  const customerResult = await pool.query(
    "SELECT * FROM bookings WHERE customer_id=$1",
    [userId]
  );

  if (customerResult.rows.length === 0) {
    throw new Error("No bookings found for this customer");
  }

  return customerResult.rows;
};

export const updateBookingFromDB = async (
  bookingId: number,
  userId: number,
  role: "customer" | "admin"
) => {
  const bookingRes = await pool.query("SELECT * FROM bookings WHERE id=$1", [
    bookingId,
  ]);

  if (bookingRes.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingRes.rows[0];

  if (role === "customer") {
    if (booking.customer_id !== userId) {
      throw new Error("Not allowed");
    }

    const today = new Date();
    const startDate = new Date(booking.rent_start_date);

    if (today >= startDate) {
      throw new Error("Cannot cancel after rental starts");
    }

    const updatedBookingRes = await pool.query(
      "UPDATE bookings SET status='cancelled' WHERE id=$1 RETURNING *",
      [bookingId]
    );

    await pool.query(
      "UPDATE vehicles SET availability_status='available' WHERE id=$1",
      [booking.vehicle_id]
    );

    return {
      message: "Booking cancelled",
      booking: updatedBookingRes.rows[0],
    };
  }

  if (role === "admin") {
    const updatedBookingRes = await pool.query(
      "UPDATE bookings SET status='returned' WHERE id=$1 RETURNING *",
      [bookingId]
    );

    await pool.query(
      "UPDATE vehicles SET availability_status='available' WHERE id=$1",
      [booking.vehicle_id]
    );

    return {
      message: "Vehicle returned successfully",
      booking: updatedBookingRes.rows[0],
    };
  }
};

export const bookingServices = {
  createBookingService,
  getBookingsFromDB,
  updateBookingFromDB,
};
