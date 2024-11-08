import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config(); 

const app = express();


// Middleware

app.use(express.json());
app.use(cookieParser());

// Cors

const corsOptions = {
    origin: 'http://localhost:5173',  
    credentials: true,
};

app.use(cors(corsOptions));

// Routes
app.use('/api', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/products', productRoutes);


export default app;
