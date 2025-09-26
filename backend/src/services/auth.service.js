import User from '../models/user.model.js';
import Otp from '../models/otp.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/mailer.util.js';


const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOtp = async (user, type) => {
  const otpCode = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Hết hạn sau 10 phút

  await Otp.create({ userId: user._id, otpCode, type, expiresAt });

  if (user.email && (type === 'EMAIL_VERIFICATION' || type === 'PASSWORD_RESET')) {
    await sendEmail(
      user.email,
      `Mã OTP xác thực cho ${type === 'EMAIL_VERIFICATION' ? 'đăng ký' : 'đặt lại mật khẩu'}`,
      `Mã OTP của bạn là: ${otpCode}. Mã này sẽ hết hạn sau 10 phút.`
    );
  } else if (user.phone && type === 'PHONE_VERIFICATION') {
    console.log(`Gửi SMS tới ${user.phone} với mã OTP: ${otpCode}`);
  }
};


const register = async (userData) => {
  const { name, email, phone, password } = userData;


  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    throw new Error('Email hoặc số điện thoại đã được sử dụng.');
  }


  const passwordHash = await bcrypt.hash(password, 10);


  const newUser = await User.create({
    name,
    email,
    phone,
    passwordHash,
  });


  const otpType = email ? 'EMAIL_VERIFICATION' : 'PHONE_VERIFICATION';
  await sendOtp(newUser, otpType);

  return { message: 'Đăng ký thành công. Vui lòng kiểm tra email/tin nhắn để xác thực tài khoản.' };
};

const verifyOtp = async (identifier, otpCode) => {
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    if (!user) throw new Error('Người dùng không tồn tại.');

    const otpEntry = await Otp.findOne({ userId: user._id, otpCode, expiresAt: { $gt: new Date() } });
    if (!otpEntry) throw new Error('Mã OTP không hợp lệ hoặc đã hết hạn.');

    if (otpEntry.type === 'EMAIL_VERIFICATION') user.isEmailVerified = true;
    if (otpEntry.type === 'PHONE_VERIFICATION') user.isPhoneVerified = true;
    
    await user.save();
    await Otp.deleteOne({ _id: otpEntry._id });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    return { message: 'Xác thực thành công!', token, user: { id: user._id, name: user.name, email: user.email } };
};

const login = async (identifier, password) => {
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw new Error('Email/số điện thoại hoặc mật khẩu không chính xác.');
    }

    if (!user.isEmailVerified && !user.isPhoneVerified) {
        await sendOtp(user, user.email ? 'EMAIL_VERIFICATION' : 'PHONE_VERIFICATION');
        throw new Error('Tài khoản chưa được xác thực. Một mã OTP mới đã được gửi.');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    return { token, user: { id: user._id, name: user.name, email: user.email } };
};

const forgotPassword = async (identifier) => {
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    if (!user) throw new Error('Người dùng không tồn tại.');

    await sendOtp(user, 'PASSWORD_RESET');
    return { message: 'Yêu cầu thành công. Vui lòng kiểm tra email/tin nhắn để nhận mã OTP đặt lại mật khẩu.' };
};

const resetPassword = async (identifier, otpCode, newPassword) => {
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    if (!user) throw new Error('Người dùng không tồn tại.');

    const otpEntry = await Otp.findOne({ userId: user._id, otpCode, type: 'PASSWORD_RESET', expiresAt: { $gt: new Date() } });
    if (!otpEntry) throw new Error('Mã OTP không hợp lệ hoặc đã hết hạn.');

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    await Otp.deleteOne({ _id: otpEntry._id });

    return { message: 'Mật khẩu đã được đặt lại thành công.' };
};


export default {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  sendOtp: sendOtp, 
};