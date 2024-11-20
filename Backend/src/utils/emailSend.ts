import nodemailer from 'nodemailer';


export const emailSend = async (email: string, OTP: string) =>{
    const transporter = nodemailer.createTransport({
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
        subject: "Otp For Authentication",
        text: `This is your otp ${OTP} for authentication`,
        html: `<p>Your OTP for authentication is: <strong>${OTP}</strong></p>`,
        headers: { 'x-myheader': 'test header' }
    });

    console.log("Message sent: %s", info.response);
}