
const express=require("express")
const { loginController,registerController, searchController,onlineController } = require("../controllers/userController")
const protect= require("../middleware/authware")
const { accessChat, fetchChat, groupController, renameController, addController, removeController } = require("../controllers/chatController")
const { sendMsgController, allMsgController,readController } = require("../controllers/messageController")

const Router=express.Router()

Router.route("/").get(protect,searchController).post(protect,accessChat)
Router.route("/fetch").get(protect,fetchChat)
Router.route("/onlinestatus").post(protect,onlineController)
Router.route("/setread").post(protect,readController)
Router.route("/group").post(protect,groupController)
Router.route("/rename").put(protect,renameController)
Router.route("/add").post(protect,addController)
Router.route("/remove").post(protect,removeController)
Router.post('/login',loginController)
Router.post('/signup',registerController)
Router.route('/msg').post(protect,sendMsgController)
Router.route('/msg/:chatId').get(protect,allMsgController)
Router.get('/secure',protect,(req,res)=>{res.status(200).send({msg:"secure route"})})

module.exports=Router