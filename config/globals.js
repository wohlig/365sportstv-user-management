/**
 * Define Global Variables Here
 * global._ = require("lodash")
 */

 global.jwt = require("jsonwebtoken")
 global.jwtDecode = require("jwt-decode")
 global.jwtKey = env["JWT_KEY"]
 global.sha256 = require("js-sha256").sha256
 global.randomize = require("randomatic")

 global._ = require("lodash")