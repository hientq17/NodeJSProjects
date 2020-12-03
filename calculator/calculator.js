const express = require('express');
const bodyParser = require('body-parser');

const app = express();
//Set view engine to ejs
//Tell Express where we keep our index.ejs
// app.set("index", __dirname + "/index.html"); 
app.use(bodyParser.urlencoded({extended:true}));
app.get("/calculator",(req,res) => {
    res.sendFile(__dirname+"/index.html");
})
app.post("/calculate",(req,res) => {
    var num1 = Number(req.body.num1);
    var num2 = Number(req.body.num2);
    var cal = req.body.calculation;
    var result;
    switch(cal){
        case "plus":
            result = num1+num2;
            break;
        case "minus":
            result = num1-num2;
            break;
        case "multiply":
            result = num1*num2;
            break;
        case "divide":
            result = num1/num2;
            break;
    }
    result = Math.round(result*1000)/1000;
    res.send("<h1>Result: <span id='result'>"+result+"</span></h1>"+
             "<a href='/calculator' id='continue'>Click here to continue</a>");
})
app.listen(3000,()=>{
    console.log('Server started at port 3000');
});
