const mongoose=require("mongoose")

mongoose.set('strictQuery', true)
const uri = "db-path"
const client = { useNewUrlParser: true, useUnifiedTopology: true }
const dbconnect=async()=>{
    try {
        const connect=await mongoose.connect(uri,client)
        const readyState= mongoose.connection.readyState
    } catch (error) {
        console.log("error catched")
    }   
}
module.exports=dbconnect
