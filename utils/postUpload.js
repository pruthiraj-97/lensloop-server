const cloudinary=require('cloudinary').v2
exports.uploadImage=async (file)=>{
    try {
        const uploadedimage=await cloudinary.uploader.upload(file.tempFilePath,{
            folder:process.env.CLOUD_FOLDER
        })
        return uploadedimage
    } catch (error) {
        return error
    }
}