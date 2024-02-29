const jwt=require("jsonwebtoken")
const User = require("../model/userModel")
const protect= async(req,res,next)=>{
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            token=req.headers.authorization.split(" ")[1]
            const decode=jwt.verify(token,process.env.SECREAT_KEY)      //returns the id of data
            req.user=await User.findOne({_id:decode.id},"-password")    //gets the user and passes it to the controller
            next()
        }catch{(err)=>{
            res.status(401)
            throw new Error(err)
        }}
    }else{
        throw new Error("unauthorised")
    }

}
module.exports=protect