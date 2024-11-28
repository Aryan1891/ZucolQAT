import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { adminRouter } from './Routes/AdminRoute.js';
import { EmployeeRouter } from './Routes/EmployeeRoute.js';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;
const jwtSecret = 'jwt_secret_key';

// MongoDB Connection
mongoose
  .connect('mongodb+srv://aryanjangir:aryanjangir@cluster0.t9nzg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('Public'));

// Route Middleware
app.use('/auth', adminRouter);
app.use('/employee', EmployeeRouter);

// JWT Authentication Middleware
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return res.json({ Status: false, Error: 'Invalid token' });
      }
      req.id = decoded.id;
      req.role = decoded.role;
      next();
    });
  } else {
    return res.json({ Status: false, Error: 'Not authenticated' });
  }
};

// Verify User
app.get('/verify', verifyUser, (req, res) => {
  res.json({ Status: true, role: req.role, id: req.id });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
