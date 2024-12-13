import { Institute, InstituteDocument, InstituteStatus } from "../interfaces/institute.interface";
import { InstituteRepository } from "../repositories/institute.repository";
import { CreateUserDto } from "../dtos/institute.dtos";
import nodemailer from 'nodemailer';
import { helperFunction } from "../helperFunction/authHelper";
import { HttpException } from "../middleware/error.middleware";
import generator from "../utils/generateApplicationID";
import { TutorRepository } from "../repositories/tutor.repository";
import { TutorDocument } from "../interfaces/tutor.interface";
import STATUS_CODES from "../constants/statusCode";
import MESSAGES from "../constants/message";
import { ChatRepository } from "../repositories/chat.Repository";
import { ChatDocument } from "../interfaces/chat.interface";
import { CreateChatDto } from "../dtos/chat.dtos";

export class ChatService {
    private chatRepository: ChatRepository;
    constructor(chatRepository: ChatRepository) {
        this.chatRepository = chatRepository;
    }

    async getMessages(receiverId: string, senderId: string): Promise<ChatDocument[] | null> {
        try {
            const chat = await this.chatRepository.find(receiverId,senderId)
            return chat
        } catch (error) {
            throw new HttpException(STATUS_CODES.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR)
        }
    }

    async sendMessages(chatData:CreateChatDto): Promise<ChatDocument[] | null> {
        try {

            const chat = await this.chatRepository.create(chatData)
            return chat
        } catch (error) {
            throw new HttpException(STATUS_CODES.SERVER_ERROR, MESSAGES.ERROR.SERVER_ERROR)
        }
    }
}