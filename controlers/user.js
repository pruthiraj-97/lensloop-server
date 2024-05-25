const userSchema=require('../models/user.model')
const {io,isOnline}=require('../routes/socketRouter')
const Notification=require('../models/messageNotification.model')
exports.acceptFollowRequest=async (req,res)=>{
    try {
        const user=req.user
        console.log(user)
        const {id}=req.params
            await userSchema.updateOne({_id:user.id},{
                $push:{
                    followers:id
                },
                $pull:{
                    followRequests:id
                }
            })

           await userSchema.updateOne({_id:id},{ // user who is following
               $push:{
                   following:user.id
               },
               $pull:{
                   myRequests:user.id
               }
           })
          
           let notify=await Notification.create({
              user:user.id,
              message:`${user.name} accepted your request`,
              type:"follow"
           })
        
           notify=await Notification.findOne({_id:notify._id})
                                                 .populate({
                                                    path:'user',
                                                    select:'username image'
                                                })
           console.log(notify)
            if(isOnline(id)){
                const socketid=global.userSocketMap[id]
                console.log("socket is ",socketid)
                io.to(socketid).emit('notification',notify)
            }                                    
            console.log("**")
        const response=await userSchema.updateOne({_id:id},{
                $push:{
                       notification:notify._id
                     }
            })
           console.log(response)
           const profile=await userSchema.findOne({_id:user.id})
           .populate({
               path:'posts'
           })
           .populate({
             path:'followRequests',
             select:'username image'
           })
           profile.password=null
          
        return res.status(200).json({
            success:true,
            message:"followed",
            profile
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"error in following"
        })
    }
}
exports.denayFollowRequest=async (req,res)=>{
    try {
        const {id}=req.params
        const user=req.user
        await userSchema.updateOne({_id:user.id},{
            $pull:{
                followRequests:id
            }
        })
        await userSchema.updateOne({_id:id},{
            $pull:{
                myRequests:user.id
            }
        })

        let notify=await Notification.create({
            user:user.id,
            message:`${user.name} denied your request`,
            type:"follow"
        })
        notify=await Notification.findOne({_id:notify._id})
        .populate({
            path:'user',
            select:'username image'
        })
        console.log(notify)
        if(isOnline(id)){
            const socketid=global.userSocketMap[id]
                console.log("socket is ",socketid)
                io.to(socketid).emit('notification',notify)
        }
        
        const resp=await userSchema.updateOne({_id:id},{
            $push:{
                notification:notify._id
            }
        })
        console.log(resp)

        const profile = await userSchema.findOne({_id: user.id})
        .populate({
            path: 'posts'
        })
        .populate({
            path: 'followRequests',
            select: 'username image'
        });
    profile.password = null;
    console.log(profile);
    
        return res.status(200).json({
            success:true,
            message:"request denied",
            profile
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"error in denaying request"
        })
    }
}

exports.removeFollowers=async (req,res)=>{
    try {
        const {id}=req.params
        const user=req.user
        await userSchema.updateOne({
            _id:user.id
        },
        {
            $pull:{
                followers:id
            }
        })
        await userSchema.updateOne({_id:id},{
            $pull:{
                following:user.id
            }
        })
        
        const profile=await userSchema.findOne({_id:user.id})
           .populate({
               path:'posts'
           })
           .populate({
             path:'followers',
             select:'username image'
           })
           profile.password=null

        return res.status(200).json({
            success:true,
            message:"unfollowed",
            user:profile
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"error in unfollowing"
        })
    }
}
exports.addFollowing=async (req,res)=>{
    try {
        const {id}=req.params // who is following
        const user=req.user
        await userSchema.updateOne({_id:user.id},{
            $pull:{
                followRequests:id
            }
        })

        await userSchema.updateOne({
            _id:id
        },
        {
            $push:{
                following:user.id // to whome
            }
        })
        
        return res.status(200).json({
            success:true,
            message:"followed accsepted"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"error in following"
        })
    }
}

exports.sendFollowRequest=async (req,res)=>{
    try {
        const {id}=req.params // kis ko bhaj na ha
        const user=req.user
        const userExist=await userSchema.findOne({_id:id})
        if(userExist.followers.includes(user.id)){
            await userSchema.updateOne({_id:id},{
                $pull:{
                    followers:user.id
                }
            })
            await userSchema.updateOne({_id:user.id},{
                $pull:{
                    following:id
                }
            })
        }
        else if(!userExist.followRequests.includes(user.id)){
        await userSchema.updateOne({_id:id},{
           $push:{
             followRequests:user.id
           }
        })
        await userSchema.updateOne({_id:user.id},{
            $push:{
                myRequests:id
            }
        })
       }else{
        await userSchema.updateOne({_id:id},{
            $pull:{
              followRequests:user.id
            }
         })
         await userSchema.updateOne({_id:user.id},{
             $pull:{
                 myRequests:id
             }
         })
       }
        const profile=await userSchema.findOne({_id:user.id})
                                              .populate('posts')
                                              .populate({
                                                path:'followRequests',
                                                select:'username image'
                                               })
        profile.password=null
        return res.status(200).json({
            success:true,
            message:"request denied",
            user:profile
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"error in sending request"
        })
    }
}

exports.getProfile=async (req,res)=>{
    try {
        const user=req.user
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
            profile
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"error in getting profile"
        })
    }
}

exports.unfollowUser= async (req,res)=>{
    try {
        const {id}=req.params
        const user=req.user
        await userSchema.updateOne({_id:user.id},{
            $pull:{
                following:id
            }
        })
        await userSchema.updateOne({_id:id},{
            $pull:{
                followers:user.id
            }
        })

        const profile=await userSchema.findOne({_id:user.id})
           .populate({
               path:'posts'
           })
           .populate({
             path:'followRequests',
           })
           .populate({
            path:'following',
            select:'username image'
           })
           profile.password=null

           return res.status(200).json({
               success:true,
               message:"unfollowed",
               user:profile
           })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"error in unfollowing"
        })
    }
}

exports.searchUser=async (req,res)=>{ // done
  try {
     const searchTerm=req.query.username
     console.log(searchTerm)
     const regex=new RegExp(searchTerm,'i') // case insensitive
     const users=await userSchema.find({
        username:{
            $regex:regex
        }
     })
     return res.status(200).json({
        success:true,
        users:users,
        message:"users search"
     })
  } catch (error) {
    return res.status(404).json({
        success:false,
        message:error
    })
  }
}