import { pool } from "../../config/db";

const getAllUsersFromDB = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );
  return result;
};

const updateUserInDB = async (
  userId: string,
  payload: Record<string, unknown>
) => {
  const { name, email, phone, role } = payload;
  const result = await pool.query(
    `UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING id, name, email, phone, role`,
    [name, email, phone, role, userId]
  );
  return result;
};

const deleteUserFromDB = async (userId: string) => {
  const isBooking = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [userId]
  );
  if (isBooking.rows.length > 0) {
    const error: any = new Error(
      "User has active bookings and cannot be deleted"
    );
    error.statusCode = 409;
    throw error;
  }
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
  return result;
};

export const usersService = {
  getAllUsersFromDB,
  updateUserInDB,
  deleteUserFromDB,
};
