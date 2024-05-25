const mongoose=require('mongoose')
const storySchema=new mongoose.Schema({
    story:{
        type:String,
        require:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    likes:[
        {
          type:mongoose.Schema.Types.ObjectId,
          ref:'User'
        }
    ],
    dislikes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ]
})

module.exports=mongoose.model('Story',storySchema)
