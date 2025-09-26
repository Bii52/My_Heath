import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true, 
  },
  phone: {
    type: String,
    unique: true,
    sparse: true, 
  },
  passwordHash: {
    type: String,
    required: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  medicalProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalProfile',
  },
}, { timestamps: true });

// Đảm bảo email hoặc phone phải được cung cấp
UserSchema.pre('save', function (next) {
  if (!this.email && !this.phone) {
    next(new Error('Email hoặc số điện thoại là bắt buộc.'));
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);
export default User;