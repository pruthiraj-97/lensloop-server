const mongoose=require('mongoose')
exports.connectDB=async ()=>{
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log("DB connect success")
    } catch (error) {
        console.log("error in db connect",error)
    }
}