const Message=require('../models/message.model')
const conversation=require('../models/Chat')
const {io,isOnline}=require('../routes/socketRouter')
exports.getMessages=async(req,res)=>{
    try {
        const {id}=req.params
        const user=req.user
        const messages=await conversation.findOne({
            users:{
                $all:[user.id,id]
            }
        })
        .populate({
            path:'messages',
            populate:{
                path:'sender receiver',
                select:'username image'
            }
        })
        return res.status(200).json({
            status:200,
            success:true,
            messages:messages.messages
        })
    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            message:error
        })
    }
}
exports.addMessage=async (req,res)=>{
    try {
        const user=req.user
        const {id}=req.params
        const {message}=req.body
        console.log(message)
        const newMessage=await Message.create({
            message,
            sender:user.id,
            receiver:id
        })
        let conversationExist = await conversation.findOne({
            users: {
                $all: [user.id, id]
            }
        });
        
        if (!conversationExist) {
             await conversation.create({
                users: [user.id, id],
                messages: [newMessage]
            });
        } else {
             await conversation.findOneAndUpdate(
                { users: { $all: [user.id, id] } },
                { $push: { messages: newMessage } },
                { new: true } 
            );
        }
        
        const messages=await conversation.findOne({
            users:{
                $all:[user.id,id]
            }
        })
        .populate({
            path:'messages',
            populate:{
                path:'sender receiver',
                select:'username image'
            }
        })

        const sendMessage=await Message.findOne({
            _id:newMessage._id
        })
        .populate({
            path:'sender receiver'
        })
        
        if(isOnline(id)){
            const socketid=global.userSocketMap[id]
            io.to(socketid).emit('message',sendMessage)
        }

        return res.status(200).json({
            success:true,
            status:200,
            messages:messages.messages,
            users:messages.users
            
        })
        
    } catch (error) {
        return res.status(500).json({
            status:500,
            success:false,
            message:error
        })
    }
}