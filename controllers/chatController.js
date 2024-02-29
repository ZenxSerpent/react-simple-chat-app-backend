const expressAsyncHandler = require("express-async-handler")
const Chat = require("../model/chatModel")
const User = require("../model/userModel")


const accessChat= async (req,res)=>{
    const {userId}=req.body

    if(!userId){
        throw new Error("Uid not sent")
    }

    var isChat=await Chat.find({
        isGroup:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]
    }).populate("users","-password").populate("lastmessage")
  
    isChat=await User.populate(isChat,{path:"lastmessage.sender",select:"name email pic"})

    if(isChat.length>0){
        res.send(isChat[0])
    }else{
        var chatData={
            chatname:"sender",
            isGroup:false,
            users:[req.user._id,userId]
        }
        
        try {
            const createdChat=await Chat.create(chatData)
            const fullChat=await Chat.findOne({_id:createdChat._id}).populate("users","-password")
            res.send(fullChat)
        } catch (error) {
            
        }
    }
    
}

const fetchChat=async(req,res)=>{
    try {
        var data=await Chat.find({users:{$elemMatch:{$eq:req.user._id}}})    //var is must because its a promise
        .populate("users","-password")
        .populate("lastmessage")
        .populate("groupAdmin","-password").sort({updatedAt:-1})
        data=await User.populate(data,{
            path:"lastmessage.sender",
            select:"name email pic"
        })
        res.send(data)
        
    } catch (error) {
        res.send(error)
    }
}

const groupController=async(req,res)=>{
    if(!req.body.users || !req.body.name){
        return res.send("user feild empty")
    }
    if(req.body.users.length<2){
        return res.send("add more than 2 users")
    }
    const users=JSON.parse(req.body.users)
    users.push(req.user._id)
    try {
        const group=await Chat.create({
            chatname:req.body.name,
            isGroup:true,
            users:users,
            groupAdmin:req.user,
            groupPic:req.body.groupPic
        })

        const fullGroup=await Chat.findOne({_id:group._id}).populate("users","-password").populate("groupAdmin","-password")
        res.send(fullGroup)
    } catch (error) {
        res.send(error)
    }
}

const renameController=async(req,res)=>{
    const {groupId,name}=req.body

    if(name.length<1){
        return res.send("name cant be empty")
    }

    const data=await Chat.findByIdAndUpdate(groupId,{chatname:name},{new:true}).populate("users","-password").populate("groupAdmin","-password")    // returns the updated value in data
        
    res.send(data)
    
    if(!data){
        res.send("no chat found")
    }
}

const addController=async(req,res)=>{

    const {chatId,userId}=req.body

    const userExist=await Chat.findOne({_id:chatId})
    if(userExist.users.includes(userId)){
        res.send({err:`user already exists`})
    }else{
        var addeduser=await User.findOne({_id:userId})
        console.log(addeduser)
        if(!addeduser){
            res.send({err:`user not found`})
        }
        else{
            var added=await Chat.findByIdAndUpdate(chatId,
                {$push:{users:userId}},
                {new:true})
                if(!added){
                    res.send({err:`can't add ${addeduser.name} try again later`})
                
                }else{
                    res.send({msg:`${addeduser.name} added successfully`})
                }
        }
    
    }
    
    
} 
const removeController=async(req,res)=>{

    const {chatId,userId}=req.body
    const removeduser=await User.findOne({_id:userId})
    var removed=await Chat.findByIdAndUpdate(chatId,
    {$pull:{users:userId}},
    {new:true})
    if(!removed){
        res.send({err:`can't remove ${removeduser.name} try again later`})
    }else{
        res.send({msg:`${removeduser.name} removed successfully`,selectedChat:removed})
    }
} 
module.exports={accessChat,fetchChat,groupController,renameController,removeController,addController}