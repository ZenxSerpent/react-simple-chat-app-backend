const mongoose=require("mongoose")
const User = require("./userModel")
const Chat = require("./chatModel")

const messageSchema=mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chat'
    },
    content:{
        type:String
    },
    read:{
        type:Boolean
    }
},{timestamps:true})

const Message=mongoose.model("Message",messageSchema)
module.exports=Message