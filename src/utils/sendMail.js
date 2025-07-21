import { envConfig } from '../config/env.js';
import { templateMail } from '../template/Mailtemplate.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: false,
    auth: {
        user: envConfig.nodeMailer.email,
        pass: envConfig.nodeMailer.password,
    },
});

export const sendMail = async ({ email, template, type }) => {
    const info = await transporter.sendMail({
        from: 'BITTIS <no-reply@BITISTORE.com>',
        to: email,
        subject: `${template?.subject}`,
        html: templateMail(type, template),
        replyTo: undefined,
    });
    console.log('message send : %s', info.messageId);
};
