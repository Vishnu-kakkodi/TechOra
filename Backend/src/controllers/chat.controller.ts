import { Request, Response, NextFunction } from "express";
import { InstituteService } from "../services/institute.service";
import { CreateUserDto, CreateTutorDto } from "../dtos/institute.dtos";
import { HttpException } from "../middleware/error.middleware";
import { setCookie } from "../helperFunction/cookieUtils";
import { decodedToken } from "../helperFunction/authHelper";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { ChatService } from "../services/chat.service";

export class ChatController{
    constructor(private readonly chatService: ChatService){}

    async getMessages(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const {receiverId} = req.params;
            const senderId =  req.body;
            const chat = await this.chatService.getMessages(receiverId,senderId);
            res.json({ chat,message:"Login successfully" });
        } catch (error) {
            next(error)
        }
    }

    // async sendMessages(
    //     req: Request,
    //     res: Response,
    //     next: NextFunction
    // ): Promise<void> {
    //     try {
    //         const text = req.body;
    //         const {receiverId} = req.params;
    //         const senderId = req.body
    //         const chatData = {
    //             senderId:senderId,
    //             receiverId:receiverId,
    //             text:text
    //         }
    //         // const chat = await this.chatService.sendMessages(chatData);
    //         res.json({ chat,message:"Login successfully" });
    //     } catch (error) {
    //         next(error)
    //     }
    // }

}