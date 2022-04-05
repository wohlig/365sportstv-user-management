var schema = new Schema(
    {
        otp : [
            {
                userId : { type: Schema.Types.ObjectId, ref: "User" },
                otp: { type: String, required: true },
                otpDate: { type: Date},
                otpCount: { type: Number, default: 0 }
            }
        ]
    },
    {
        timestamps: true
    }
)
export default mongoose.model("OtpCount", schema)
