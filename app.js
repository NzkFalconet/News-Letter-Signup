const express= require('express');
const app= express();
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
const request = require("request");

const https= require('https');
const { response } = require('express');

app.use(express.static("Public"));
app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/signup.html")
})

app.post('/',(req,res)=>{
    const fname=req.body.fname;
    const lname=req.body.lname;
    const email = req.body.email;
    if(!fname || !lname || !email)
    {
        res.sendFile(__dirname+"/failure.html");
    }
    const data= {
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:fname,
                    LNAME:lname
                }

            }
        ]
    }

    const jsonData=JSON.stringify(data);
   
    const url="https://us10.api.mailchimp.com/3.0/lists/cec02783c5";

    const options={
        method:"POST",
        auth: "shaan:d1e8e93b75324c2b316ae0cd0aa60394-us10"
    }
    const request = https.request(url,options, (response)=>{
        response.on("data",(data)=>{
          //  console.log(JSON.parse(data));
            const statusCode=response.statusCode;
            if(statusCode===200)
            res.sendFile(__dirname+"/success.html");
            else
            res.sendFile(__dirname+"/failure.html");
        })
    })

    request.write(jsonData);
    request.end();
});


app.post("/failure",(req,res)=>{
    res.redirect("/");
})



app.listen(process.env.PORT || 3000,()=>{
    console.log("server started at port 3000");
})




// api key = d1e8e93b75324c2b316ae0cd0aa60394-us10
// list id=cec02783c5