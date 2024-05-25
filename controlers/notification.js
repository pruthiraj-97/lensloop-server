const Notification=require('../models/messageNotification.model')
const userSchema=require('../models/user.model')
exports.removeNotification=async (req,res)=>{
    try {
        const user=req.user
        await userSchema.updateOne({
            _id:user.id},{
              notification:[]
            },
            {new:true}
            )
            const profile=await userSchema.findOne({
                _id:user.id
            })
            .populate({
                path:'posts'    
            })
            .populate({
                path:'followRequests',
                select:'username image'
            })
            .populate({
                path:'notification',
                populate:{
                    path:'user',
                    select:'username image'
                }
            })
            profile.password=null
        return res.status(200).json({
            success:true,
            message:'notifications cleared',
            profile
        })    
    } catch (error) {
        return res.status(400).json({success:false,message:error})
    }
}