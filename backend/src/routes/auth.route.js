import express from 'express';
import authController from '../controllers/auth.controller.js';
import {
  validate,
  registerValidation,
  loginValidation,
  otpValidation,
  resetPasswordValidation,
} from '../middlewares/validator.middleware.js';

const authRoute = express.Router();

authRoute.post('/register', registerValidation, validate, authController.register);
authRoute.post('/login', loginValidation, validate, authController.login);
authRoute.post('/send-otp', authController.sendOtp);
authRoute.post('/verify-otp', otpValidation, validate, authController.verifyOtp);
authRoute.post('/forgot-password', authController.forgotPassword);
authRoute.post('/reset-password', resetPasswordValidation, validate, authController.resetPassword);

export { authRoute };