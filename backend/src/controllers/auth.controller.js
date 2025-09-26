import authService from '../services/auth.service.js';
import User from '../models/user.model.js';

const handleRequest = (handler) => async (req, res) => {
  try {
    const result = await handler(req.body, req.params, req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const register = handleRequest(async (body) => {
  return authService.register(body);
});

const verifyOtp = handleRequest(async (body) => {
    const { identifier, otpCode } = body;
    return authService.verifyOtp(identifier, otpCode);
});

const login = handleRequest(async (body) => {
    const { identifier, password } = body;
    return authService.login(identifier, password);
});

const forgotPassword = handleRequest(async (body) => {
    const { identifier } = body;
    return authService.forgotPassword(identifier);
});

const resetPassword = handleRequest(async (body) => {
    const { identifier, otpCode, newPassword } = body;
    return authService.resetPassword(identifier, otpCode, newPassword);
});

const sendOtp = handleRequest(async (body) => {
    const { identifier } = body;
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    if (!user) throw new Error('Người dùng không tồn tại.');
    await authService.sendOtp(user, user.email ? 'EMAIL_VERIFICATION' : 'PHONE_VERIFICATION');
    return { message: 'Đã gửi lại mã OTP.' };
});

export default {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  sendOtp,
};