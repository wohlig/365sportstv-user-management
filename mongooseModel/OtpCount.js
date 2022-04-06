var schema = new Schema(
    {
        mobile: { type: Number },
        otp: { type: String, required: true },
        otpDate: { type: String },
        otpCount: { type: Number, default: 0 }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("OtpCount", schema)
