const express = require("express")
const router = express.Router()

const userController = require("../controller/UserControllers")



router.post("/signup", userController.signUp)

router.post("/login", userController.logIn) 

router.get("/userdetails", userController.getUsers)   



 
module.exports=router 