var schema = new Schema(
    {
        name: String,
        mobile: { type: String, unique: true, required: true },
        password: { type: String, default: "" },
        accessLevel: String,
        mobileVerification: Number,
        mobileVerified: { type: Boolean, default: false },
        userType: {
            type: String,
            enum: ["Admin", "User"],
            default: "User",
            index: true
        },
        status: {
            type: String,
            enum: ["enabled", "disabled", "archived"],
            default: "enabled",
            index: true
        },
        freeTrialUsed: { type: Boolean, default: false },
        planDetails: {
            type: Schema.Types.Mixed
        },
        language: {
            type: String,
            default: "English"
        },
        signUpDate: { type: Date }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("User", schema)
