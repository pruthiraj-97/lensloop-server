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
            status:200,
            message:'notifications cleared',
            profile
        })    
    } catch (error) {
        return res.status(500).json({success:false,status:500,message:error})
    }
}