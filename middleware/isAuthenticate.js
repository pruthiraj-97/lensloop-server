const jwt=require('jsonwebtoken')
exports.isAuthenticate=(req,res,next)=>{
    try {
      const token=req.headers['x-auth-token']
      if(!token){
        return res.status(400).json({success:false,message:'token not found'})
      }
      jwt.verify(token,process.env.SECRET_KEY,(err,payload)=>{
           if(err){
            return res.status(401).json({
              status:401,
              success:false,
              message:'Token expaired'
            })
           }
           req.user=payload
           next()
      })
      
    } catch (error) {
        return res.status(400).json({success:false,message:'error in token varification'})
    }
}