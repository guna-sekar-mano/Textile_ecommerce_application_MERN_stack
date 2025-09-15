import nodemailer from 'nodemailer';

const sendMail = (data) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const otp = Math.floor(1000 + Math.random() * 9000);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: data.Email,
            subject: 'Extreme Culture OTP Verification',
            text: 'Extreme Culture signup otp number is :' + otp
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                console.log('Email Sent');
                resolve({ status: 'Email Sent', otp });
            }
        });
    });
};

export default sendMail;
