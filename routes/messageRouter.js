const express=require('express')
const router=express.Router()
const {isAuthenticate}=require('../middleware/isAuthenticate')
const {addMessage,getMessages}=require('../controlers/message')
router.post('/addmessage/:id',isAuthenticate,addMessage)
router.get('/getmessage/:id',isAuthenticate,getMessages)
module.exports=router