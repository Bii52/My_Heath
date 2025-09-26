import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  otpCode: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['EMAIL_VERIFICATION', 'PHONE_VERIFICATION', 'PASSWORD_RESET'],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

const Otp = mongoose.model('Otp', OtpSchema);
export default Otp;