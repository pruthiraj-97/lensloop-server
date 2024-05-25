const express=require('express')
const {createServer}=require('http')
const {Server}=require('socket.io')
const app=express()
const server=createServer(app)
const io=new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    credentials:true
  }
})

global.userSocketMap = {};

function isOnline(userId){
    return userSocketMap[userId]
}

io.on('connection',socket=>{
    socket.on('setUserId', (newUserId) => {
        console.log("new user is ",newUserId)
        if(!userSocketMap[newUserId]){
          userSocketMap[newUserId] = socket.id;
        }
        console.log("userSocketMap",userSocketMap)
    })
    
    socket.on("disconnect",()=>{
        for (let userId in userSocketMap) {
            if (userSocketMap[userId] == socket.id) {
              delete userSocketMap[userId];
              break;
            }
          }
    })

})

module.exports={io,server,app,isOnline}