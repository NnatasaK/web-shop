import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

dotenv.config(); 

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);


export default app;
