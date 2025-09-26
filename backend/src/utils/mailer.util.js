import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"My Health App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log('✅ Email đã được gửi thành công');
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi gửi email:', error.message);
    return false;
  }
};
