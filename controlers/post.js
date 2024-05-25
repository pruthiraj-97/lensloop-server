const Post=require('../models/posts.model')
const userSchema=require('../models/user.model')
const {uploadImage}=require('../utils/postUpload')
const Notification=require('../models/messageNotification.model')
const {io,isOnline}=require('../routes/socketRouter')
exports.createPost=async (req,res)=>{
    try {
        const file = req.files.post;
        const {title,description}=req.body
        if(!title || !file){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const user=req.user
        const id=user.id
        const image=await uploadImage(file)
        const newPost=await Post.create({
            title,
            post:image.secure_url,
            userId:id,
            description
        })
        await userSchema.updateOne({
            _id:id
        },
        {
            $push:{
                posts:newPost._id
            }
        })
        return res.status(200).json({
            success:true,
            message:"post created successfully"
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"error in creating post"
        })
    }
}

exports.likePost=async (req,res)=>{
    try {
        const {id}=req.params
        let user=req.user
        let post=await Post.findById(id)
        const likes=post.likes
        const dislikes=post.dislikes
        if(dislikes.includes(user.id)){
            await Post.updateOne({_id:id},{
                $pull:{
                    dislikes:user.id
                }
            })
        }
        let likePost=null
        if(likes.includes(user.id)){
           likePost=await Post.updateOne({_id:id},{
               $pull:{
                   likes:user.id
               }
           })
        }else{
            likePost=await Post.updateOne({_id:id},{
                $push:{
                    likes:user.id
                }
            })
        }
        post=await Post.findById(id)
        .populate({
            path:'comments',
            populate:{
                path:'userId',
                select:'username image'
            }
        })
        .populate({
            path:'userId',
            select:'username image'
        })
        
        
        if(post.likes.includes(user.id)){
            const likeUser=await userSchema.findById(post.userId)
            let notify = await Notification.create({
                user: user.id,
                message: `${user.name} liked your post`,
                type: 'like'
            })
            notify =await Notification.findOne({_id:notify._id})
                                                  .populate({
                                                    path:'user',
                                                    select:'username image'
                                                  })
            if(isOnline(post.userId._id)){
            console.log("socket connect")
            const socketid=global.userSocketMap[post.userId._id]
            io.to(socketid).emit("newNotification",notify)
            }
               if(notify.user._id!=post.userId._id){
                console.log(notify.user._id,post.userId._id)
               const temp = await userSchema.findByIdAndUpdate(post.userId._id, {
                $push: { notification: notify._id }
            }, { new: true }); 
         }
                  
        }
        return res.status(200).json({
            success:true,
            message:"post liked",
            post
        })


    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"error in liking post"
        })
    }
}

exports.deletePost=async (req,res)=>{
    try {
        const {id}=req.params
        const  user=req.user
        await Post.deleteOne({
            _id:id
        })
        await userSchema.updateOne({
            _id:user.id
        },
        {
            $pull:{
                posts:id
            }
        })
        return res.status(200).json({
            success:true,
            message:"post deleted"
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"error in deleting post",
            error
        })
    }
}

exports.getPost=async (req,res)=>{
    try {
        const posts=await Post.find()
                          .populate({
                            path:'comments',
                            populate:{
                                path:'userId',
                                select:'username image'
                            }
                          })
                          .populate({
                            path:'userId',
                            select:'username image'
                        })               
        return res.status(200).json({
            success:true,
            posts
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"error in getting posts"
        })
    }
}

exports.dislikePost=async (req,res)=>{
    try {
        let user=req.user
        const {id}=req.params
        let post=await Post.findById(id)
        const dislikes=post.dislikes
        const likes=post.likes
        if(likes.includes(user.id)){
            await Post.updateOne({_id:id},
            {
                $pull:{
                    likes:user.id
                }
            })
        }

        if(dislikes.includes(user.id)){
           await Post.updateOne({_id:id},
            {
                $pull:{
                    dislikes:user.id
                }
            })
        }else{
          await Post.updateOne({_id:id},
            {
                $push:{
                    dislikes:user.id
                }
            })
        }
        post=await Post.findById(id)
                                .populate({
                                    path:'comments',
                                    populate:{
                                        path:'userId',
                                        select:'username image'
                                    }
                                })
                                .populate({
                                    path:'userId',
                                    select:'username image'
                                })
                if(post.dislikes.includes(user.id)){
                    const dislikeUser=await userSchema.findById(post.userId._id)
                        let notify = await Notification.create({
                            user: user.id,
                            message: `${user.name} disliked your post`,
                            type: 'like'
                        })
                        notify =await Notification.findOne({_id:notify._id})
                                                              .populate({
                                                                path:'user',
                                                                select:'username image'
                                                              })
                                                              if(isOnline(post.userId._id)){
                                                                const socketid=global.userSocketMap[post.userId._id]
                                                                console.log("socket connect")
                                                                io.to(socketid).emit("newNotification",notify)
                                                                }
                                                                   if(notify.user._id!=post.userId._id){
                                                                    console.log(notify.user._id,user.id)
                                                                   const temp = await userSchema.findByIdAndUpdate(post.userId._id, {
                                                                    $push: { notification: notify._id }
                                                                }, { new: true }); 
                                                             }
                        }

        return res.status(200).json({
            success:true,
            message:"post disliked",
            post
        })
    } catch (error) {
       return res.status(400).json({
           success:false,
           message:"error in disliking post"
       })
    }
}

exports.getMyPost= async(req,res)=>{
    try {
        const {id}=req.params
        const user=req.user
        const post=await Post.findOne({_id:id})
                                           .populate({
                                               path:'comments',
                                               populate:{
                                                   path:'userId',
                                                   select:'username image'
                                               }
                                           })
        return res.status(200).json({
            success:true,
            post
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"error in getting posts"
        })
    }
}