const mongoose=require("mongoose")
const Chat = require("./chatModel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String,
     
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chat'
    },
    pic:{
        type:String,
     
    },
    online:{
        type:Boolean,
        required:true
    }
},{timestamps:true})

userSchema.methods.matchPassword=async function(pass){
        return await bcrypt.compare(pass,this.password)
}
userSchema.methods.generateToken=function(id){
        this.token=jwt.sign({id},process.env.SECREAT_KEY)
        this.save()
        return this.token
}
userSchema.pre('save',async function (next){
    if(!this.isModified('password')){
        next()
    }
    const salt= await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
})

const User=mongoose.model("User",userSchema)
module.exports=User
