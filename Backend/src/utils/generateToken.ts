import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const generateToken = (res: Response, userId: string): void => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: '2min'
    });

    console.log("Token generated:", token);

    res.cookie('user_jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 2 * 60 * 1000 
    });
};

export const generateAdminToken = (res: Response, adminId: string): void => {
    const adminToken = jwt.sign({ adminId }, process.env.JWT_ADMIN_SECRET as string, {
        expiresIn: '30d'
    });

    res.cookie('admin_jwt', adminToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 
    });
};
