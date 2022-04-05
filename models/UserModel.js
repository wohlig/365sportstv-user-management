import { sha256 } from "js-sha256"
import User from "../mongooseModel/User"

export default {
    async signup(data) {
        let saveUser
        const ifAlreadyUser = await User.findOne({ mobile: data.mobile })
        if (
            ifAlreadyUser &&
            ifAlreadyUser._id &&
            ifAlreadyUser.mobileVerified
        ) {
            return { data: "User Already Exist", value: false }
        }

        let newUserObj = {
            name: data.name,
            mobile: data.mobile,
            password: sha256(data.password),
            userType: data.userType
        }

        if (_.isEmpty(ifAlreadyUser) || !ifAlreadyUser._id) {
            let userObj = new User(newUserObj)
            saveUser = await userObj.save()
            if (saveUser && !saveUser._id) {
                return {
                    data: "Something Went Wrong While Saving User",
                    value: false
                }
            }
        } else {
            const updateUser = await User.updateOne(
                { _id: ifAlreadyUser._id },
                newUserObj
            )
            if (updateUser && !updateUser.modifiedCount) {
                return { data: "Failed to Save User", value: false }
            }
            saveUser = ifAlreadyUser
        }

        const otpOutput = await UserModel.sendOtpToMobileNumber({
            mobile: data.mobile
        })
        if (otpOutput && !otpOutput.value) {
            return { data: otpOutput.data, value: false }
        }

        return { data: saveUser._id, value: true }
    },
    async sendOtpToMobileNumber(data) {
        const randomCode = randomize("0", 4)
        // let outp = await axios.get(`https://wtsapp.aronertech.com/api/sendText?token=${wtsapInstance}&phone=91${data.mobile}&message=${randomCode} is your One time Password for Verification of Taj-Exchange Account. Don't share it`)
        // if (outp.data.status === 'success') {

        if (randomCode) {
            data.updateObj = {
                mobileVerification: randomCode
            }
            return await UserModel.updateUser(data)
        } else {
            return { data: "Failed to Send SMS", value: false }
        }
    },
    async verifyMobile(data) {
        const checkIfUserAvailable = await User.findOne({
            _id: data._id
        })
        if (_.isEmpty(checkIfUserAvailable)) {
            return { data: "No Such User Exists", value: false }
        }
        if (
            checkIfUserAvailable.mobileVerification !==
            Number(data.verificationCode)
        ) {
            return { data: "Incorrect OTP", value: false }
        }
        // if (Number(data.verificationCode) !== Number(1111)) {
        //     return { data: "Incorrect OTP", value: false }
        // }
        const accessTokenOutput = await UserModel.generateAccessToken(data)
        if (accessTokenOutput && !accessTokenOutput.value) {
            return { data: accessTokenOutput.data, value: false }
        }
        let objToUpdate = {
            mobileVerified: true,
            mobileVerification: null
        }
        const userOutput = await User.updateOne({ _id: data._id }, objToUpdate)
        if (
            userOutput &&
            !userOutput.modifiedCount &&
            !checkIfUserAvailable.mobileVerified
        ) {
            return { data: "Failed to Update User", value: false }
        }
        return { data: accessTokenOutput.data, value: true }
    },
    async generateAccessToken(data) {
        const userAvailable = await User.findOne({ _id: data._id })
        if (_.isEmpty(userAvailable)) {
            return { data: "No Such User Exists", value: false }
        }
        let objToGenerateAccessToken = {
            _id: userAvailable._id,
            name: userAvailable.name,
            mobile: userAvailable.mobile,
            currentPlan: userAvailable.planDetails
        }
        var token = jwt.sign(objToGenerateAccessToken, jwtKey)
        objToGenerateAccessToken.accessToken = token
        return { data: objToGenerateAccessToken, value: true }
    },
    async login(data) {
        const checkUser = await User.findOne(
            { mobile: data.mobile },
            { name: 1, accessLevel: 1, mobile: 1, password: 1 }
        )
        if (_.isEmpty(checkUser)) {
            return { data: "Incorrect Username or Password.", value: false }
        }
        let encryptedPassword = sha256(data.password)
        if (checkUser.password != encryptedPassword) {
            return { data: "Incorrect Password", value: false }
        }
        const obj = {
            _id: checkUser._id
        }
        return UserModel.generateAccessToken(obj)
    },
    async forgotPassword(data) {
        const userIfAvailable = await User.findOne({
            mobile: data.mobile,
            mobileVerified: true
        })
        if (_.isEmpty(userIfAvailable)) {
            return { data: "No Such User Exists", value: false }
        }
        const mobileOutput = await UserModel.sendOtpToMobileNumber({
            mobile: data.mobile
        })
        if (mobileOutput && !mobileOutput.value) {
            return { data: mobileOutput.data, value: false }
        }

        return { data: userIfAvailable._id, value: true }
    },

    async forgotPasswordVerification(data) {
        const userAvailable = await User.findOne({
            _id: data._id
        })
        if (_.isEmpty(userAvailable)) {
            return { data: "No Such User Exists", value: false }
        }
        if (
            userAvailable.mobileVerification !== Number(data.verificationCode)
        ) {
            return { data: "Incorrect OTP", value: false }
        }
        let objToUpdate = {
            mobileVerification: null
        }
        const x = await User.updateOne({ _id: data._id }, objToUpdate)
        const obj = {
            _id: userAvailable._id
        }
        const accessTokenData = await UserModel.generateAccessToken(obj)
        if (accessTokenData && !accessTokenData.value) {
            return { data: accessTokenOutput.data, value: false }
        }
        return { data: accessTokenData.data, value: true }
    },
    async resetPassword(data, user) {
        // const sub = jwt.verify(data.accessToken, jwtKey)
        // if (_.isEmpty(sub) || !sub._id || !sub.mobile || !sub.name) {
        //     return { data: "Incorrect AccessToken", value: false }
        // }
        const userAvailable = await User.findOne({
            _id: user._id,
            mobile: user.mobile,
            mobileVerified: true
        })
        if (_.isEmpty(userAvailable) || !userAvailable._id) {
            return { data: "No Such User Exists", value: false }
        }
        if (userAvailable.password === sha256(data.password)) {
            return { data: "Password Changed Successfully", value: true }
        }
        const updateUser = await User.updateOne(
            { _id: userAvailable._id },
            {
                password: sha256(data.password)
            }
        )
        if (updateUser && updateUser.modifiedCount) {
            return { data: "Password Changed Successfully", value: true }
        }
        return { data: "Failed to Change Password", value: false }
    },
    async changePassword(data, user) {
        // const sub = jwt.verify(data.accessToken, jwtKey)
        // if (_.isEmpty(sub) || !sub._id || !sub.mobile || !sub.name) {
        //     return { data: "Incorrect AccessToken", value: false }
        // }
        const userAvailable = await User.findOne({
            _id: user._id,
            mobile: user.mobile,
            mobileVerified: true
        })
        if (_.isEmpty(userAvailable) || !userAvailable._id) {
            return { data: "No Such User Exists", value: false }
        }
        if (userAvailable.password === sha256(data.oldPassword)) {
            const updateUser = await User.updateOne(
                { _id: userAvailable._id },
                {
                    password: sha256(data.password)
                }
            )
            if (updateUser && updateUser.modifiedCount) {
                return { data: "Password Changed Successfully", value: true }
            } else {
                return { data: "Failed to Change Password", value: false }
            }
        }
        return { data: "Incorrect Old Password", value: false }
    },

    async updateUser(data) {
        const updateOutput = await User.updateOne(
            { mobile: data.mobile },
            data.updateObj
        )
        if (updateOutput && !updateOutput.modifiedCount) {
            return { data: "Failed to Update User OTP", value: false }
        }
        return { data: "Otp Sent Successfully", value: true }
    },
    getOne: async (mobile) => {
        return await User.findOne({
            mobile: mobile
        }).exec()
    },
    getUserByAuthToken: async (id) => {
        return await User.findOne({
            _id: id
        }).exec()
    },
    async getUserById(id) {
        return await User.findOne({
            _id: id
        }).exec()
    }
}
