const Comment=require('../models/comments.model')
const Post=require('../models/posts.model')
exports.addComment=async (req,res)=>{
    try {
        const {id}=req.params
        const user=req.user
        const {comment}=req.body
        if(!comment){
            return res.status(400).json({
                success:false,
                message:'comment is required'
            })
        }
        const newComment=await Comment.create({
            comment:comment,
            userId:user.id,
            postId:id
        })
        await Post.updateOne({_id:id},
            {
                $push:{comments:newComment._id}
            })
        let post=await Post.findById(id)
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
            message:'comment added',
            post
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:'error in adding comment'
        })
    }
}

exports.editComment=async (req,res)=>{
    try {
        const {id}=req.params
        const user=req.user
        const {comment}=req.body
        const updatePost=await Comment.updateOne({_id:id},{
            $set:{
                comment:comment
            }
        })
        return res.status(200).json({
            success:true,
            message:'comment updated',
            comment:updatePost
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:'error in updating comment'
        })
    }
}

exports.deleteComment=async (req,res)=>{
    try {
        const {id}=req.params
        const user=req.user
        const comment=await Comment.findById(id)
        const deleteComment=await Comment.deleteOne({_id:id})
        await Post.updateOne({_id:comment.postId},{
            $pull:{
                comments:id
            }
        })
        const post=await Post.findById(comment.postId)
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
            message:'comment deleted',
            comment:deleteComment,
            post
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:'error in deleting comment'
        })
    }
}