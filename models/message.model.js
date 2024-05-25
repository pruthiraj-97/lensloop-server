const mongoose=require('mongoose')
const message=mongoose.Schema({
    message:{
        type:String,
        require:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    }
})
module.exports=mongoose.model('Message',message)