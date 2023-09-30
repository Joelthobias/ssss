import nodemailer from 'nodemailer';

const mailSender = async (email, title, body) => {
    console.log(email);
    try {
        // Create a Transporter to send emails
        let transporter = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: 'daf416b4ad0ee5',
                pass: '13fe683b1ca137',
            }
        });
        // Send emails to users
        let info = await transporter.sendMail({
            from: 'www.sandeepdev.me - Sandeep Singh',
            to: email,
            subject: title,
            html: body,
        });
        console.log("Email info: ", info);
        return info;
    } catch (error) {
        console.log("err : ", error.message);
    }
};

export default mailSender;
