import * as nodemailer from 'nodemailer';

export interface EmailOptions {
    destinationEmail: string;
    subject: string;
    body: string;
}

export const sendEmail = (emailOptions: EmailOptions) => {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: emailOptions.destinationEmail,
        subject: emailOptions.subject,
        html: emailOptions.body
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    transporter.sendMail(mailOptions, (err: any, info: any) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent to ', emailOptions.destinationEmail);
        }
    });
}