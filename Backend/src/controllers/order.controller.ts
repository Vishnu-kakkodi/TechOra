import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
import { decodedToken } from "../helperFunction/authHelper";
import { HttpException } from "../middleware/error.middleware";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import generator from "../utils/orderIdGenerate";
import { IOrderService } from "../interfaces/IServiceInterface/IOrderService";
import Razorpay from 'razorpay';
import { OrderDocument } from "../type/order.type";



dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET, {
    apiVersion: process.env.STRIPE_API_VERSION,
});

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

interface NewOrderBody {
    orderDetails: {
        orderItems: [{ courseId: string, name: string, description: string, thumbnail: string, price: number }],
        total: number
    }
}

interface ExistingOrderBody {
    orderDetails: {
        orderId: string;
        orderItems: [{ courseId: string, name: string, description: string, thumbnail: string, price: number }],
        total: number
    }
}

type OrderBody = NewOrderBody | ExistingOrderBody;


function isExistingOrder(order: OrderBody): order is ExistingOrderBody {
    return 'orderId' in order.orderDetails;
}


export class OrderController {
    private orderService: IOrderService;

    constructor(orderService: IOrderService) {
        this.orderService = orderService;
        this.createOrder = this.createOrder.bind(this);
    }

    // async createOrder(
    //     req: Request,
    //     res: Response,
    //     next: NextFunction
    // ): Promise<void> {
    //     try {
    //         const { orderItems, total } = req.body.orderDetails;
    //         const paymentMethod = req.body.paymentMethod;
    //         if (!Array.isArray(orderItems) || typeof total !== 'number') {
    //             throw new HttpException(STATUS_CODES.BAD_REQUEST,MESSAGES.ERROR.INVALID_ORDER_DETAIL);
    //         }
    //         const userId: string | null = req.user?._id;
    //         let order;
    //         const orderId = generator.generateID()
    //         if (isExistingOrder(req.body)) {
    //             order = await this.orderService.getOrderById(req.body.orderDetails.orderId);
    //             if (!order) {
    //                 throw new HttpException(STATUS_CODES.NOT_FOUND,MESSAGES.ERROR.ORDER_NOT_FOUND);
    //             }
    //         } else {
    //             order = await this.orderService.createOrder(
    //                 orderId,
    //                 userId,
    //                 orderItems,
    //                 total
    //             );
    //         }
    //         if(paymentMethod==='stripe'){
    //             const lineItems = orderItems.map(product => ({
    //                 price_data: {
    //                     currency: "inr",
    //                     product_data: {
    //                         name: product.name,
    //                         description: product.description,
    //                         images: [product.thumbnail]
    //                     },
    //                     unit_amount: Math.round(product.price * 100)
    //                 },
    //                 quantity: 1
    //             }));
                
    //             const session = await stripe.checkout.sessions.create({
    //                 payment_method_types: ["card"],
    //                 line_items: lineItems,
    //                 mode: "payment",
    //                 success_url: `${process.env.FRONT_END_URL}/success?orderId=${order._id}`,
    //                 cancel_url: `${process.env.FRONT_END_URL}/cancel?orderId=${order._id}`,
    //             });
    //             res.json({
    //                 status:STATUS_CODES.SUCCESS,
    //                 message: MESSAGES.SUCCESS.DATA_RETRIEVED,
    //                 data: session.id,
    //             });
    //         }else if(paymentMethod==='razorpay'){

    //         }
    //     } catch (error) {
    //         next(error)
    //     }
    // }


    async createOrder(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { orderItems, total } = req.body.orderDetails;
            const paymentMethod = req.body.paymentMethod;
            console.log(paymentMethod,"Method")
            console.log(req.body.orderDetails,"Method")

            if (!Array.isArray(orderItems) || typeof total !== 'number') {
                throw new HttpException(STATUS_CODES.BAD_REQUEST, MESSAGES.ERROR.INVALID_ORDER_DETAIL);
            }
    
            const userId: string | null = req.user?._id;
            let order: OrderDocument;
            const orderId = generator.generateID()
    
            if (isExistingOrder(req.body)) {
                order = await this.orderService.getOrderById(req.body.orderDetails.orderId);
                if (!order) {
                    throw new HttpException(STATUS_CODES.NOT_FOUND, MESSAGES.ERROR.ORDER_NOT_FOUND);
                }
            } else {
                order = await this.orderService.createOrder(
                    orderId,
                    userId,
                    orderItems,
                    paymentMethod,
                    total
                );
            }
    
            if (paymentMethod === 'stripe') {
                const lineItems = orderItems.map(product => ({
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: product.name,
                            description: product.description,
                            images: [product.thumbnail]
                        },
                        unit_amount: Math.round(product.price * 100)
                    },
                    quantity: 1
                }));
                
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    line_items: lineItems,
                    mode: "payment",
                    success_url: `${process.env.FRONT_END_URL}/success?orderId=${order._id}`,
                    cancel_url: `${process.env.FRONT_END_URL}/cancel?orderId=${order._id}`,
                });
    
                res.json({
                    status: STATUS_CODES.SUCCESS,
                    message: MESSAGES.SUCCESS.DATA_RETRIEVED,
                    data: session.id,
                });
            } else if (paymentMethod === 'razorpay') {
                const razorpayOrder = await razorpay.orders.create({
                    amount: Math.round(total * 100), 
                    currency: 'INR',
                    receipt: order._id as string,
                    notes: {
                        orderId: order._id as string,
                        userId: userId?.toString()
                    }
                });
    
                // await this.orderService.updateOrder(order._id, {
                //     razorpayOrderId: razorpayOrder.id
                // });
    
                res.json({
                    status: STATUS_CODES.SUCCESS,
                    message: MESSAGES.SUCCESS.ORDER_CREATED,
                    data: {
                        orderID:order._id,
                        order: razorpayOrder,
                        orderDetails: order
                    }
                });
            } else {
                throw new HttpException(
                    STATUS_CODES.BAD_REQUEST,
                    MESSAGES.ERROR.INVALID_PAYMENT_METHOD
                );
            }
        } catch (error) {
            next(error)
        }
    }


    async paymentSuccess(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const orderId= req.body.orderId;
            console.log(req.body);
            console.log(orderId,"llllllllllllllllllllllllllll");
            const userId: string | null = req.user?._id;
            console.log(userId,"llllllllllllllllllllllllllll");
            const order = await this.orderService.updatePayment(orderId,userId);
            console.log("Okkkk");   
            res.json({
                status: STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.DATA_RETRIEVED,
                data:order
            });
        } catch (error) {
            next(error)
        }
    }

    async orderList(
        req: Request<{}, {}>,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const search = (req.query.search as string);
            const filter = (req.query.filter as string);
            const sort = (req.query.sort as string);
            const userId: string | null = req.user?._id;           
            const {orders,total} = await this.orderService.orderList(userId,page,limit,search,filter,sort);
            res.json({
                status: STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.DATA_RETRIEVED,
                data:{orders,total}
            });
        } catch (error) {
            next(error)
        }
    }

    async orderDetail(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>{
        try{
            const orderId = req.params.orderId
            const order = await this.orderService.orderDetail(orderId);
            res.json({
                status:STATUS_CODES.SUCCESS,
                message: MESSAGES.SUCCESS.DATA_RETRIEVED,
                data:order
            });
        }catch(error){
            next(error);
        }
    }

}