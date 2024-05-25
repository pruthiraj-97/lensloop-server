const express=require('express')
const {createStory,removeStory,likeStory,getStory,addComment,dislikeStory,getMyStory}=require('../controlers/story')
const {isAuthenticate}=require('../middleware/isAuthenticate')
const router=express.Router()
router.post('/addstory',isAuthenticate,createStory)
router.delete('/removestory/:id',isAuthenticate,removeStory)
router.post('/likestory/:id',isAuthenticate,likeStory)
router.post('/dislikestory/:id',isAuthenticate,dislikeStory)
router.get('/getstory',isAuthenticate,getStory)
router.post('/addcomment/:id',isAuthenticate,addComment)
router.get('/getmystory',isAuthenticate,getMyStory)
module.exports=router