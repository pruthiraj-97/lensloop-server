const express=require('express')
const router=express.Router()
const {isAuthenticate}=require('../middleware/isAuthenticate')
const {removeNotification}=require('../controlers/notification')
router.delete('/removenotification',isAuthenticate,removeNotification)
module.exports=router