# 🚗 Vehicle Rental System – Backend API

A RESTful backend API for managing a vehicle rental system.  
This project handles user management, vehicle inventory, bookings, and role-based access control.

---

## 🌐 Live Deployment

🔗 **Live API URL:**  
<https://rental-system-chi-three.vercel.app>

🔗 **GitHub Repository:**  
<https://github.com/tareqferdous/next-level-assignment-2>

---

## 🎯 Project Overview

The Vehicle Rental System backend provides APIs to:

- Manage users (admin & customer roles)
- Maintain vehicle inventory with availability tracking
- Handle vehicle bookings with pricing calculation
- Support booking cancellation and return logic
- Ensure secure and scalable backend architecture

The system is designed following a **modular architecture** with clear separation of concerns.

---

## ✨ Features

### 👥 User Management

- User registration with password hashing
- User login with JWT-based authentication
- Role-based users: **Admin** and **Customer**
- CRUD operations for users (role-based access)

### 🚙 Vehicle Management

- Add, update, view, and delete vehicles
- Track vehicle availability (`available`, `booked`)
- Restrict vehicle management to admin users

### 📅 Booking Management

- Create vehicle bookings
- Automatically calculate total rental cost
- Prevent booking unavailable vehicles
- Cancel bookings (before rental start date)
- Return vehicles and update availability
- Admin can view all bookings, customers can view their own

### 🔐 Security

- Password hashing using bcrypt
- JWT-based authentication
- Role-based authorization
- Secure API endpoints using middleware

---

## 🛠️ Technology Stack

- **Node.js**
- **TypeScript**
- **Express.js**
- **PostgreSQL**
- **bcrypt**
- **jsonwebtoken (JWT)**
- **pg** (PostgreSQL client)
- **dotenv**

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository

```bash
git clone <https://github.com/tareqferdous/next-level-assignment-2>
cd project_name
npm install
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
npm run dev
```
