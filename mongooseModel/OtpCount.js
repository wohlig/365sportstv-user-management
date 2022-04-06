var schema = new Schema(
    {
        mobile: { type: Number },
        otpDate: { type: String },
        otpCount: { type: Number, default: 0 }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("OtpCount", schema)
