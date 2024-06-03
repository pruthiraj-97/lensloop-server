const userSchema=require('../models/user.model')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const axios=require('axios')
exports.signup=async (req,res)=>{
    try {
        const {username,email,password,accountType}=req.body
        if(!username || !email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const userExist=await userSchema.findOne({
          email:email
        })
       if(userExist){
        return res.status(400).json({
            success:false,
            message:"user already exist"
        })
     }
    
     const hashpassword=await bcrypt.hashSync(password,10)
     const image=`https://avatar.iran.liara.run/public/boy?username=${username}`
     const newUser=await userSchema.create({
        username:username,
        email:email,
        password:hashpassword,
        accountType,
        image
     })

     return res.status(200).json({
        success:true,
        message:"user created successfully",
     })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`Internal server error ${error}`
        })
    }
}

exports.login=async (req,res)=>{
    try {
        const {email,password}=req.body
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }   
       const userExist=await userSchema.findOne({
           email:email
       })
       if(!userExist){
        return res.status(400).json({
            success:false,
            message:"Invalid credentials"
        })
       }
       const result=await bcrypt.compareSync(password,userExist.password)
       if(!result){
        return res.status(400).json({
            success:false,
            message:"Invalid credentials"
        })
       }
       const payload={
          name:userExist.username,
          email:userExist.email,
          id:userExist._id
       }
       const token=await jwt.sign(payload,process.env.SECRET_KEY,{
        expiresIn: "24h"
       })
       
       return res.status(200).json({
        success:true,
        message:"user logged in successfully",
        token,
        user:userExist
       })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

exports.getUserprofile=async (req,res)=>{
    try {
        const {id}=req.params
        const userId=req.user.id
        const userProfile=await userSchema.findOne({_id:id})
                                                  .populate({
                                                    path:'posts',
                                                    select:'post'
                                                  })
                                                  .populate({
                                                    path:'followers',
                                                    select:'username image'
                                                  })
                                                  .populate({
                                                    path:'following',
                                                    select:'username image'
                                                  })
        userProfile.password=null
            return res.status(200).json({
                success:true,
                userProfile
            })
    }catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}