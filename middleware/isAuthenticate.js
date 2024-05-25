const jwt=require('jsonwebtoken')
exports.isAuthenticate=(req,res,next)=>{
    try {
      const token=req.headers['x-auth-token']
      if(!token){
        return res.status(400).json({success:false,message:'token not found'})
      }
      const payload=jwt.verify(token,process.env.SECRET_KEY)
      if(!payload){
        return res.status(400).json({success:false,message:'invalid token'})
      }
      req.user=payload
      next()
    } catch (error) {
        return res.status(400).json({success:false,message:'error in token varification'})
    }
}