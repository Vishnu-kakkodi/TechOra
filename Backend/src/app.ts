import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from './routes/user.routes'
import adminRoutes from './routes/admin.routes'
import institutionRoutes from './routes/institution.routes'
import { errorMiddleware } from "./middleware/error.middleware";
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/institution', institutionRoutes);
app.use(errorMiddleware);


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techOra')
.then(()=>console.log("Connected to MongoDB"))
.catch((err) => console.error('MongoDB connection:',err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

export default app;