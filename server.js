const path =require("path")
const fs=require("fs")
const stream=require("stream")
const express=require("express")
const server=express()

const dbconnect=require("./db/dbconnect")
const SchemaFile=require("./db/schemaFile")

server.use(express.json())
server.use(express.urlencoded({extended:true}))
server.use(express.static(path.join(__dirname,"./public")))

server.get("/",async(req,res)=>{
    await dbconnect()
    res.sendFile("home.html",{root:path.join(__dirname,"./public")})
})

server.post("/post",async(req,res)=>{
    await dbconnect()
    const filename=req.headers.filename
    await SchemaFile.deleteMany()
    const ws=fs.createWriteStream(filename)
    const ws2=fs.createWriteStream(`2_${filename}`)
    const dbtransfer=new stream.Transform({
        transform(chunk,encoding,cb){
            const schemaFile=new SchemaFile({
                registerTime:new Date().getTime(),
                bufferCounter:"String",
                fileName:filename,
                fileSelf:chunk
            })
            const buffer=schemaFile.fileSelf.map(item=>item)
            ws2.write(buffer)
            console.log("time is save")
            console.log(schemaFile.registerTime)
            schemaFile.save()
            console.log("==============================================")
            cb(null,chunk)
        }
    })
    stream.pipeline(
        req,
        dbtransfer,
        ws,
        err=> {if (err) {console.log(err)}}
    )
    res.redirect("/completed")
})

server.get("/find-one",async(req,res)=>{
    const ws=fs.createWriteStream("dbpicture.jpg")
    await dbconnect()
    const foundone=await SchemaFile.find({})
    foundone.sort((a,b)=>a.registerTime-b.registerTime)
    foundone.forEach(item=>{
       const buffer=item.fileSelf.map(field=>field)
       console.log(item.registerTime)
       ws.write(buffer)
    })
    res.redirect("/")
})

server.get("/completed",(req,res)=>{
    res.send("file completed !!!!")
})


server.listen(3000,()=>{
    console.log("/////////////////////////////////////")
})
