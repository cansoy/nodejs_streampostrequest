const mongoose=require("mongoose")
const Schema=mongoose.Schema

const schemaFile=new Schema({
    registerTime:String,
    bufferCounter:String,
    fileName:String,
    fileSelf:Buffer
})

const SchemaFile=mongoose.model("SchemaFile",schemaFile)

module.exports=SchemaFile