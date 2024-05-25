const Story=require('../models/story.model')
const userSchema=require('../models/user.model')
const {uploadImage}=require('../utils/postUpload')
const Comment=require('../models/comments.model')
exports.createStory=async (req,res)=>{
    try {
        const user=req.user
        const story=req.files.story
        const uploadstory=await uploadImage(story)
        const newStory=await Story.create({
            userId:user.id,
            story:uploadstory.secure_url
        })
       return res.status(201).json({
            success:true,
            message:'story created successfully',
            story:newStory
        })
    } catch (error) {
       return res.status(400).json({
            status:'fail',
            message:error
        })
    }
}

exports.removeStory=async (req,res)=>{
    try {
        const user=req.user
        const {id}=req.params
        await Story.deleteOne({
            _id:id
        })
        return res.status(200).json({
            success:true,
            message:'story removed successfully'
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error
        })
    }
}

exports.likeStory=async (req,res)=>{
    try {
        const user=req.user
        const {id}=req.params
        const {userId}=req.body
        let story=await Story.findById(id)
        const likes=story.likes
        const dislikes=story.dislikes
        let likeStory=null
        if(dislikes.includes(user.id)){
            await Story.updateOne({_id:id},{
                $pull:{
                    dislikes:user.id
                }
            })
        }
        if(likes.includes(user.id)){
            likeStory=await Story.updateOne({_id:id},{
                $pull:{
                    likes:user.id
                }
            })
        }else{
            likeStory=await Story.updateOne({_id:id},{
                $push:{
                    likes:user.id
                }
            })
        }
       const stories=await Story.find({
           userId:userId
       })
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
            message:'story liked',
            stories
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error
        })
    }
 }
 exports.dislikeStory=async (req,res)=>{ 
    try {
        const {id}=req.params
        const user=req.user
        const {userId}=req.body
        let story=await Story.findById(id)
        const dislikes=story.dislikes
        const likes=story.likes
        if(likes.includes(user.id)){
            await Story.updateOne({_id:id},{
                $pull:{
                    likes:user.id
                }
            })
        }

        if(dislikes.includes(user.id)){
            await Story.updateOne({_id:id},{
                $pull:{
                    dislikes:user.id
                }
            })
        }else{
            await Story.updateOne({_id:id},{
                $push:{
                    dislikes:user.id
                }
            })
        }
        const stories=await Story.find({
            userId:userId
        })
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
            message:'story disliked',
            stories
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error
        })
    }
 }

 exports.getStory= async(req,res)=>{ // it is wroking
    try {
        const user=req.user
        const userExist=await userSchema.findOne({_id:user.id})
        const following=userExist.following
        let storyMap={}
        const story=await Story.find()
                                    .populate({
                                        path:'userId',
                                        select:'username image'
                                    })
                                    .populate({
                                        path:'comments',
                                        populate:{
                                            path:'userId',
                                            select:'username image'
                                        }
                                    })   
        story.forEach((s)=>{
            if(following.includes(s.userId._id)){
                if(s.userId._id in storyMap){
                    storyMap[s.userId._id].push(s)
                }else{
                    storyMap[s.userId._id]=[s]
                }
            }
        })
        
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
        return res.status(200).json({
            status:'success',
            story:storyMap,
            profile
        })
    } catch (error) {
        return res.status(400).json({
            status:'fail',
            message:error
        })
    }
 }

 exports.addComment=async (req,res)=>{
    try {
        const {id}=req.params
        const {comment}=req.body
        const {userId}=req.body
        const user=req.user
        if(!comment){
            return res.status(400).json({
                success:false,
                message:'comment is required'
            })
        }
    const newComment=await Comment.create({
        comment,
        userId:user.id
    })
        await Story.updateOne({_id:id},{
            $push:{
                comments:newComment._id
            }
        })

        const stories=await Story.find({
            userId:userId
        })
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
           message:'comment added in story',
           stories
       })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:'error in adding comment in story'
        })
    }
 }

 exports.getMyStory=async (req,res)=>{
    try {
        const user=req.user
        const story=await Story.find({userId:user.id})
                                                   .populate({
                                                    path:'comments',
                                                    populate:{
                                                        path:'userId',
                                                        select:'username image'
                                                    }
                                                   })
        return res.status(200).json({
            success:'success',
            story
        })
    } catch (error) {
        return res.status(400).json({
            status:'fail',
            message:error
        })
    }
 }