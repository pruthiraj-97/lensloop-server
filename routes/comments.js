const express=require('express')
const { isAuthenticate } = require('../middleware/isAuthenticate')
const {addComment,editComment,deleteComment}=require('../controlers/comments')
const router=express.Router()
router.post('/addcomment/:id',isAuthenticate,addComment)
router.put('/editcomment/:id',isAuthenticate,editComment)
router.delete('/deletecomment/:id',isAuthenticate,deleteComment)
module.exports=router