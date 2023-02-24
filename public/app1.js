const btn1=document.querySelector("#btn1")
const input1=document.querySelector("#input1")
const file1=document.querySelector("#file1")
const errorMsg=document.querySelector(".error")

btn1.addEventListener("click",()=>{
    const file=file1.files[0]
    if (!file) return
    const reader=new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload=()=>{
        const result=reader.result
        const uint8=new Uint8Array(result)
        fetch("/post",{
            method:"post",
            headers:{"filename":file.name},
            body:uint8
        })
            .then(res=>{
                if (res.statusText!=="OK") {
                    const msg={
                        bodyUsed:res.bodyUsed,
                        redirected:res.redirected,
                        type:res.type,
                        status:res.status,
                        statusText:res.statusText,
                        url:res.url
                    }
                    errorMsg.textContent= JSON.stringify(msg)
                    return
                }
                window.location.reload()
            })
            .catch(err=>{console.log(err)})
    }

})