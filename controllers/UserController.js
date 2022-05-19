const router = Router()
// Signup
router.post("/signup", async (req, res) => {
    try {
        var data = await UserModel.signup(req.body)
        if (data.value) {
            res.status(200).json(data.data)
        } else {
            res.status(500).json(data.data)
        }
    } catch (error) {
        res.status(500).send(error)
    }
})
// Login
router.post(
    "/login",
    ValidateRequest({
        body: {
            type: "object",
            properties: {
                mobile: { type: "string" },
                password: { type: "string" }
            },
            required: ["mobile", "password"]
        }
    }),
    async (req, res) => {
        try {
            let outputData = await UserModel.login(req.body)
            if (outputData && outputData.value) {
                res.status(200).json(outputData.data)
            } else {
                res.status(500).json(outputData.data)
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }
)
router.post(
    "/adminLogin",
    authenticateAdmin,
    ValidateRequest({
        body: {
            type: "object",
            properties: {
                mobile: { type: "string" },
                password: { type: "string" },
                userType: { type: "string", enum: ["Admin"] }
            },
            required: ["mobile", "password"]
        }
    }),
    async (req, res) => {
        try {
            let outputData = await UserModel.adminLogin(req.body)
            if (outputData && outputData.value) {
                res.status(200).json(outputData.data)
            } else {
                res.status(500).json(outputData.data)
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }
)
// Forgot Password
router.post(
    "/forgotPassword",
    ValidateRequest({
        body: {
            type: "object",
            properties: {
                mobile: { type: "string" }
            },
            required: ["mobile"]
        }
    }),
    async (req, res) => {
        try {
            let outputData = await UserModel.forgotPassword(req.body)
            if (outputData && outputData.value) {
                res.status(200).json(outputData.data)
            } else {
                res.status(500).json(outputData.data)
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }
)
// Change Password
router.post(
    "/changePassword",
    ValidateRequest({
        body: {
            type: "object",
            properties: {
                oldPassword: { type: "string" },
                password: { type: "string" }
            },
            required: ["oldPassword", "password"]
        }
    }),
    authenticateUser,
    async (req, res) => {
        try {
            let outputData = await UserModel.changePassword(req.body, req.user)
            if (outputData && outputData.value) {
                res.status(200).json(outputData.data)
            } else {
                res.status(500).json(outputData.data)
            }
        } catch (error) {
            if (
                error &&
                error.message &&
                error.message == "invalid signature"
            ) {
                res.status(500).json("Not a Valid Request")
            } else {
                res.status(500).send(error)
            }
        }
    }
)
// Reset Password
router.post(
    "/resetPassword",
    ValidateRequest({
        body: {
            type: "object",
            properties: {
                password: { type: "string" }
            },
            required: ["password"]
        }
    }),
    authenticateUser,
    async (req, res) => {
        try {
            let outputData = await UserModel.resetPassword(req.body, req.user)
            if (outputData && outputData.value) {
                res.status(200).json(outputData.data)
            } else {
                res.status(500).json(outputData.data)
            }
        } catch (error) {
            if (
                error &&
                error.message &&
                error.message == "invalid signature"
            ) {
                res.status(500).json("Not a Valid Request")
            } else {
                res.status(500).send(error)
            }
        }
    }
)

router.post("/verifyMobile", async (req, res) => {
    try {
        let outputData = await UserModel.verifyMobile(req.body)
        if (outputData && outputData.value) {
            res.status(200).json(outputData.data)
        } else {
            res.status(500).json(outputData.data)
        }
    } catch (error) {
        res.status(500).send(error)
    }
})
router.post("/resendOtp", async (req, res) => {
    try {
        let outputData = await UserModel.sendOtpToMobileNumber(req.body)
        if (outputData && outputData.value) {
            res.status(200).json(outputData.data)
        } else {
            res.status(500).json(outputData.data)
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post(
    "/forgotPasswordVerification",
    ValidateRequest({
        body: {
            type: "object",
            properties: {
                _id: { type: "string" },
                verificationCode: { type: "string" }
            },
            required: ["_id", "verificationCode"]
        }
    }),
    async (req, res) => {
        try {
            let outputData = await UserModel.forgotPasswordVerification(
                req.body
            )
            if (outputData && outputData.value) {
                res.status(200).json(outputData.data)
            } else {
                res.status(500).json(outputData.data)
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }
)

router.post(
    "/getUser",
    ValidateRequest({
        params: {
            type: "object",
            properties: {
                mobile: { type: "string" }
            }
        }
    }),
    authenticateUser,
    async (req, res) => {
        try {
            const data = await UserModel.getOne(req.body.mobile)
            res.json(data)
        } catch (error) {
            console.error(error)
            res.status(500).json(error)
        }
    }
)

router.post("/getUserByAuthToken", authenticateUser, async (req, res) => {
    try {
        const data = await UserModel.getUserByAuthToken(req.user._id)
        res.json(data)
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
})
router.put("/updateUserLanguage", authenticateUser, async (req, res) => {
    try {
        const data = await UserModel.updateUserLanguage(req.user._id, req.body)
        res.json(data)
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
})
router.get(
    "/getUserById/:id",
    ValidateRequest({
        params: {
            type: "object",
            properties: {
                id: { type: "string", format: "objectId" }
            }
        }
    }),
    authenticateAdmin,
    async (req, res) => {
        try {
            const data = await UserModel.getUserById(req.params.id)
            res.json(data)
        } catch (error) {
            console.error(error)
            res.status(500).json(error)
        }
    }
)
router.put(
    "/updateUserByAdmin/:id",
    ValidateRequest({
        params: {
            type: "object",
            properties: {
                id: { type: "string", format: "objectId" }
            }
        }
    }),
    authenticateAdmin,
    async (req, res) => {
        try {
            const data = await UserModel.updateUserByAdmin(
                req.params.id,
                req.body
            )
            res.json(data)
        } catch (error) {
            console.error(error)
            res.status(500).json(error)
        }
    }
)
router.put(
    "/updateUserPasswordByAdmin/:id",
    ValidateRequest({
        params: {
            type: "object",
            properties: {
                id: { type: "string", format: "objectId" }
            }
        }
    }),
    authenticateAdmin,
    async (req, res) => {
        try {
            const data = await UserModel.updateUserPasswordByAdmin(
                req.params.id,
                req.body
            )
            res.json(data)
        } catch (error) {
            console.error(error)
            res.status(500).json(error)
        }
    }
)
router.post(
    "/addUserByAdmin",
    ValidateRequest({
        body: {
            type: "object",
            properties: {
                name: { type: "string" },
                mobile: { type: "string" },
                password: { type: "string" }
            }
        }
    }),
    authenticateAdmin,
    async (req, res) => {
        try {
            const data = await UserModel.addUserByAdmin(req.body)
            res.json(data)
        } catch (error) {
            console.error(error)
            res.status(500).json(error)
        }
    }
)
//search

router.post("/searchForAdmin", authenticateAdmin, async (req, res) => {
    try {
        const data = await UserModel.searchForAdmin(req.body)
        res.json(data)
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
})
router.post("/getTotalUsersForAdmin", authenticateAdmin, async (req, res) => {
    try {
        const data = await UserModel.getTotalUsersForAdmin(req.body)
        res.json(data)
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
})
export default router
