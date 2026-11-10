import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes';
import bookingRoutes from './routes/booking.routes';
import dashboardRoutes from './routes/dashboard.routes';
import customerRoutes from './routes/customer.routes';
import paymentRoutes from './routes/payment.routes';
import adminBookingRoutes from './routes/admin-booking.routes';
import calendarRoutes from './routes/calendar.routes';
import { authenticateAdmin } from './middleware/auth.middleware';
import { requireAdminRole } from './middleware/admin.middleware';

const app = express();

<<<<<<< HEAD
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
=======
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
}));
>>>>>>> ca256526af9ac307fc3a9b53b56908e24b8f2f50

app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'TRC Booking API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(
  '/api/admin',
  authenticateAdmin,
  requireAdminRole,
);

app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/bookings', adminBookingRoutes);
app.use('/api/admin/customers', customerRoutes);
app.use('/api/admin/payments', paymentRoutes);
app.use('/api/admin/calendar', calendarRoutes);

export default app;
