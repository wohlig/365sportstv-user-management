require("dotenv").config()
global.pwd = __dirname
global.env = process.env
require("./lib/globals")
require(pwd + "/config/globals")
require("./lib/mongoose.js")
require("./lib/express.js")
require(pwd + "/config/middleware.js")
require("./lib/responses.js")
require("./lib/controllers.js")
require("./lib/models.js")
const server = app.listen(env["PORT"], () => {
    console.log(`Server Started at Port ${env["PORT"]}`)
    require(pwd + "/config/cron")
})
var io = require("socket.io")(server, {
    cors: {
        origins: ["http://localhost:8080"]
    }
})
io.on("connection", (socket) => {
    console.log("a user connected")
    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
    socket.on("event", (id) => {
        console.log(id)
    })
})
