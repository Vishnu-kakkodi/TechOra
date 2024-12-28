"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailSend = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailSend = async (email, subject, data) => {
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: "techoraworld@gmail.com",
            pass: "ygop jwhp xkwg dbuc",
        },
        logger: true
    });
    const info = await transporter.sendMail({
        from: 'techoraworld@gmail.com',
        to: email,
        subject: subject,
        text: data,
        html: `<p><strong>${data}</strong></p>`,
        headers: { 'x-myheader': 'test header' }
    });
    console.log("Message sent: %s", info.response);
};
exports.emailSend = emailSend;
//# sourceMappingURL=emailSend.js.map