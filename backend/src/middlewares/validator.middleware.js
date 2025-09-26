import { body, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerValidation = [
  body('name').notEmpty().withMessage('Tên là bắt buộc'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Email không hợp lệ'),
  body('phone').optional({ checkFalsy: true }).isMobilePhone('vi-VN').withMessage('Số điện thoại không hợp lệ'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.phone) {
      throw new Error('Cần cung cấp email hoặc số điện thoại');
    }
    return true;
  }),
];

export const loginValidation = [
    body('identifier').notEmpty().withMessage('Email hoặc số điện thoại là bắt buộc'),
    body('password').notEmpty().withMessage('Mật khẩu là bắt buộc'),
];

export const otpValidation = [
    body('identifier').notEmpty().withMessage('Email hoặc số điện thoại là bắt buộc'),
    body('otpCode').isLength({ min: 6, max: 6 }).withMessage('Mã OTP phải có 6 chữ số'),
];

export const resetPasswordValidation = [
    body('identifier').notEmpty().withMessage('Email hoặc số điện thoại là bắt buộc'),
    body('otpCode').isLength({ min: 6, max: 6 }).withMessage('Mã OTP phải có 6 chữ số'),
    body('newPassword').isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),
];

export const verifyMedicineValidation = [
  body('code').notEmpty().withMessage('Mã thuốc là bắt buộc.'),
];