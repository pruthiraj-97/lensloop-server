const mongoose=require('mongoose')
const Notification=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    message:{
        type:String,
        require:true
    },
    type:{
        type:String,
        require:true
    }
})
module.exports=mongoose.model('Notification',Notification)