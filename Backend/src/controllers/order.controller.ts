import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/order.service";
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { decodedToken } from "../helperFunction/authHelper";
import { Thumbnail } from "aws-sdk/clients/medialive";
import { description } from "aws-sdk/clients/frauddetector";

dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET, {
    apiVersion: process.env.STRIPE_API_VERSION,
});

interface OrderBody {
    orderDetails: {
        orderItems: [{ courseId: string, name: string, description: string, thumbnail: string, price: number }],
        total: number
    }
}



export class OrderController {
    private orderService: OrderService;

    constructor(orderService: OrderService) {
        this.orderService = orderService;
        this.createOrder = this.createOrder.bind(this);
    }

    async createOrder(
        req: Request<{}, {},OrderBody>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { orderItems, total } = req.body.orderDetails;
            if (!Array.isArray(orderItems) || typeof total !== 'number') {
                throw new Error('Invalid order details');
            }
            const Token = req.cookies.user
            const token = Token.accessToken;
            const requiredRole = "user";
            const userId = decodedToken(token, requiredRole);
            const order = await this.orderService.createOrder(
                userId,
                orderItems,
                total
            );


            const lineItems = orderItems.map(product => ({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: product.name,
                        description: product.description,
                        images: [product.thumbnail]
                    },
                    unit_amount: Math.round(total * 100)
                },
                quantity: 1
            }));
            
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: lineItems,
                mode: "payment",
                success_url: `http://localhost:5173/success?orderId=${order._id}`,
                cancel_url: `http://localhost:5173/cancel?orderId=${order._id}`,
            });
            // const session = await stripe.checkout.sessions.create({
            //     payment_method_types: ["card"],
            //     line_items: [{
            //         price_data: {
            //             currency: "inr",
            //             product_data: {
            //                 name: "Checkout Amount"
            //             },
            //             unit_amount: Math.round(total * 100)
            //         },
            //         quantity: 1
            //     }],
            //     mode: "payment",
            //     success_url: `http://localhost:5173/success?orderId=${order._id}`,
            //     cancel_url: `http://localhost:5173/cancel?orderId=${order._id}`,
            // });
            res.json({
                id: session.id,
            });


        } catch (error) {
            next(error);
        }
    }


    async paymentSuccess(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {

            const orderId= req.body.orderId;
            const Token = req.cookies.user
            const token = Token.accessToken;
            const requiredRole = "user";
            const userId = decodedToken(token, requiredRole);

            const order = await this.orderService.updatePayment(orderId,userId);
            res.json({
                order
            });

        } catch (error) {
            next(error);
        }
    }

}