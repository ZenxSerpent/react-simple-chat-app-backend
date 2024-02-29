const User = require("../model/userModel")
const jwt=require("jsonwebtoken")

const loginController=async(req,res)=>{
    const {name,password}=req.body
    const us=await User.findOne({name})
    if (us && (await us.matchPassword(password))) {
        res.json({
            _id:us._id,
            name:us.name,
            email:us.email,
            isAdmin:us.isAdmin,
            token:us.generateToken(us._id),
            pic:us.pic
        })
    }else{
        res.status(401).send({msg:"user not found"})
    }
    
}

const registerController=async(req,res)=>{
    const {name,email,password,pic}=req.body

    if(!name || !email || !password){
        return res.send({err:"required feilds are empty"})
        
    }

    const userExist=await User.findOne({email})
    if(userExist){
        return res.send({err:"user exists"})
       
    }

    const nameExist=await User.findOne({name})
    if(nameExist){
       return res.send({err:"username already taken"})
       
    }

    const us=await User.create({name,email,password,token:"",pic,online:true})
    if(us){
       return res.send({
            _id:us._id,
            name:us.name,
            email:us.email,
            token:us.generateToken(us._id),
            pic:us.pic,
            online:us.online
        })
    }
}

const searchController=async(req,res)=>{
    const keyword=req.query.search?{
        $or:[
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}}
        ]
    }:{}

    const data=await User.find(keyword,"-password").find({_id:{$ne:req.user._id}})
    res.send(data)
}

const onlineController=async(req,res)=>{
    try {
        const {userId}=req.body
        var info=[];
        for(let i=0;i<JSON.parse(userId).length;i++)
        {
            let data=await User.findOne({_id:JSON.parse(userId)[i]})
            data={_id:data._id,online:data.online,lastseen:data.updatedAt}
            info.push(data)
           
        }

        res.send(info)
    } catch (error) {
        res.send(error)
    }
}
module.exports={loginController,registerController,searchController,onlineController}