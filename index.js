const express=require('express')
const router = require('./routes/userRoutes')
const app=express()
const cors=require("cors")
const User=require('./model/userModel')
app.use(cors())
const http=require("http")
const {Server}=require("socket.io")
const server=http.createServer(app)
const io=new Server(server,{cors:{
    origin:"https://react-simple-chat-app.onrender.com",
    methods:["GET","POST"]
},
path: '/socket.io',
transports: ['websocket','polling']
})

const dotenv=require("dotenv")
dotenv.config()
app.use(express.json())
//socket conn..
io.on("connection",(socket)=>{              //step2
    console.log("conn..ed to",socket.id)
    
    socket.on('setup',async(userData)=>{
        socket.join(userData._id)               //small small rooms created here
        await User.findByIdAndUpdate(userData._id,{online:true})
        socket.emit("connected")
        socket.on("disconnect",async()=>{
            await User.findByIdAndUpdate(userData._id,{online:false})
            console.log("disco")
        })
    })

    socket.on("join chat",(room)=>{         // both have the same chat object,thus the both joins the same room with the chat id as its name.
        socket.join(room)
    })

    socket.on("typing",(room)=>{socket.in(room).emit("typing")})
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"))
    socket.on("new message",(newMessageReceived)=>{
        var chat=newMessageReceived.chat
        if(!chat.users) return

        chat.users.forEach(user => {
            if(user._id==newMessageReceived.sender._id) return
            socket.in(user._id).emit("message recieved",newMessageReceived)   //data passesd to the small small rooms 
        });
    })

    socket.on("read ack",(data)=>{socket.in(data.room).emit("recieve ack",data.msgId)})
    socket.on("readids",(data)=>{socket.in(data.room).emit("send readids",data.msgarr)})
  
    // socket.on("send_message",({data,room})=>{       
    //     console.log(data)
    //     socket.to(room).emit("receive_message",data)   //sends message directly to id and room name for sending messages to certain room.
    // })

    // socket.on("join-room",(room)=>{         //joins rooms
    //     console.log("user joined",room)
    //     socket.join(room)
    // })

})


const mongoose=require("mongoose")
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("connection established with MONGO")
}).catch((err)=>{
    console.log('connection failed',err)
})
server.listen(5500,console.log(5500))

app.use('/user',router)