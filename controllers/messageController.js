const Chat = require('../model/chatModel')
const Message=require('../model/messageModel')
const User = require('../model/userModel')
const allMsgController=async(req,res)=>{
    
   try {
     const allmsg=await Message.find({chat:req.params.chatId}).populate("sender","name email pic").populate("chat")
     res.json(allmsg)
   } catch (error) {
    res.send(error)
   }
  }

  const sendMsgController=async(req,res)=>{
    const {chatId,content}=req.body

    if(!chatId || !content){
      res.send("invalid input")
    }

    const msg={
      sender:req.user._id,
      content:content,
      chat:chatId,
      read:false
    }

    try {
      var message = await Message.create(msg);
  
      message = await message.populate("sender", "name email pic");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name email pic",
      })
    
      await Chat.findByIdAndUpdate(req.body.chatId, { lastmessage: message });

      res.json(message)
    }catch (error) {
      res.status(400);
      throw new Error(error);
    }
  }

  const readController=async(req,res)=>{
      const{msgId,chatId}=req.body

      if (msgId && !chatId){
        const result=await Message.findByIdAndUpdate(msgId,{read:true},{new:true})
        res.send(result)
      }

      if(!msgId && chatId){
        const data=await Message.find({chat:chatId,read:false},"_id")
        const result=await Message.updateMany({chat:chatId,read:false},{$set:{read:true}})
        
          res.send(data)
      }

  
  }
  module.exports={allMsgController,sendMsgController,readController}