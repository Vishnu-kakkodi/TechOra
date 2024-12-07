import nodemailer from 'nodemailer';


export const emailSend = async (email: string, subject: string, data: string) =>{
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
        subject: subject,
        text: data,
        html: `<p><strong>${data}</strong></p>`,
        headers: { 'x-myheader': 'test header' }
    });

    console.log("Message sent: %s", info.response);
}