const express=require('express')
const cors=require('cors')
const fileUpload=require('express-fileupload')    
const {io,server,app}=require('./routes/socketRouter')
require('dotenv').config()
const {connectCloudinary}=require('./config/cloudinary')
const {connectDB}=require('./config/Database')
const userRouter=require('./routes/userRouter')
const postRouter=require('./routes/postRouter')
const commentRouter=require('./routes/comments')
const storyRouter=require('./routes/storyRouter')
const messageRouter=require('./routes/messageRouter')
const notificationRouter=require('./routes/notification')
app.get('/',(req,res)=>{
    res.send('server is running successfully')
})
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir: '/tmp/',
    createParentPath:true
}))
app.use(express.json())
app.use(cors({
    origin:"*",
    credentials:true
}))

app.use('/api/auth',userRouter)
app.use('/api/comments',commentRouter)
app.use('/api/posts',postRouter)
app.use('/api/story',storyRouter)
app.use('/api/message',messageRouter)
app.use('/api/notification',notificationRouter)

server.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})
connectDB()
connectCloudinary()