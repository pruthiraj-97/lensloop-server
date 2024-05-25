const express=require('express')
const router=express.Router()
const {signup,login,getUserprofile}=require('../controlers/Auth')
const {isAuthenticate}=require('../middleware/isAuthenticate')
const {acceptFollowRequest,removeFollowers,addFollowing,sendFollowRequest,
    getProfile,denayFollowRequest,unfollowUser,searchUser
}=require('../controlers/user')
router.post('/signup',signup)
router.post('/login',login)
router.post('/acceptfollowrequest/:id',isAuthenticate,acceptFollowRequest)
router.delete('/removefollowers/:id',isAuthenticate,removeFollowers)
router.post('/addfollowing/:id',isAuthenticate,addFollowing)
router.post('/sendfollowrequest/:id',isAuthenticate,sendFollowRequest)
router.get('/profile',isAuthenticate,getProfile)
router.get('/getuserprofile/:id',isAuthenticate,getUserprofile)
router.put('/denyfollowrequest/:id',isAuthenticate,denayFollowRequest)
router.put('/unfollowuser/:id',isAuthenticate,unfollowUser)
router.get('/searchuser',isAuthenticate,searchUser)
module.exports=router