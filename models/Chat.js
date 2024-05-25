const mongoose=require('mongoose')
const Conversation=mongoose.Schema({
    users:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
 ],
    messages:[
        {
         type:mongoose.Schema.Types.ObjectId,
         ref:'Message',
        }
     ]
})

module.exports=mongoose.model('Conversation',Conversation)