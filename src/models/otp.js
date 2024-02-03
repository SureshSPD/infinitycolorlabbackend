const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
    email: {type: String, unique: true},
    otp: String,
    createAt: Date,
    expiresAt: Date,
    organization: String,
});

const OTP = mongoose.model("OTPStore", OTPSchema);

module.exports = OTP;
     