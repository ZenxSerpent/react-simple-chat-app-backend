const mongoose=require("mongoose")
const User = require("./userModel")
const Message = require("./messageModel")

const chatSchema=mongoose.Schema({
    chatname:{
        type:String
    },
    isGroup:{type:Boolean},
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    lastmessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    groupPic:{
        type:String
    }
})

const Chat=mongoose.model("Chat",chatSchema)
module.exports=Chat