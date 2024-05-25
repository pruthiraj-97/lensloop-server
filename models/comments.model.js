const mongoose=require('mongoose')
const commentSchema=new mongoose.Schema({
    comment:{
        type:String,
        require:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }
},{timestamps:true})

module.exports=mongoose.model('Comment',commentSchema)