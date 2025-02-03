    import express from "express";
    import mongoose from "mongoose";
    import cors from "cors";
    import authRoutes from './routes/auth.routes'
    import userRoutes from './routes/user.routes'
    import adminRoutes from './routes/admin.routes'
    import institutionRoutes from './routes/institution.routes'
    import tutorRoutes from './routes/tutor.routes'
    import { errorMiddleware } from "./middleware/error.middleware";
    import cookieParser from 'cookie-parser';
    import dotenv from 'dotenv';
    import socketConfig from './socketConfig';
    import http from 'http';

    const stripe = require("stripe")(process.env.STRIPE_SECRET)
    dotenv.config();
    const app = express();
    const server = http.createServer(app);

    const allowedOrigins = [
        'https://techora.online',
        'http://localhost:5173',
        'http://10.0.2.2:5000',
        'http://localhost:3000',
        'http://192.168.56.228:5000'
      ];



    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, origin);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'role'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400
    }));


    app.use(express.json());
    app.use(cookieParser());

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/institution', institutionRoutes);
    app.use('/api/tutor', tutorRoutes);


    app.use(errorMiddleware);

    socketConfig.initializeSocket(server);


    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techOra')
    .then(()=>console.log("Connected to MongoDB"))
    .catch((err) => console.error('MongoDB connection:',err));

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })

    export default app;