import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema({
  mobileNumber: { type: String },
  email: { type: String },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "5m" }
});

export default mongoose.model("OTP", otpSchema);