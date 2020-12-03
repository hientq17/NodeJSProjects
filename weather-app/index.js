const express = require('express');
const https = require('https');
const bodyParser = require('body-parser')
const app = express();

//get access data from view(html) as a object inside bracket
app.use(bodyParser.urlencoded({extended:true})); 

app.get("/", (req,res) => {
    res.sendFile(__dirname+"/index.html"); 
});

app.post("/get-weather", (req,res) => {
    var city = req.body.cityName;
    console.log(city);
    var units = "metric"
    const api = "3bd83ba4f121d775f756522f6f5a767d"
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units="+units+"&appid="+api;
    //send url
    https.get(url, (response) => {
        console.log(response.statusCode);
        //if response is ready
        response.on("data",(data) => {
            var weatherData = JSON.parse(data);
            var temp = weatherData.main.temp;
            var description = weatherData.weather[0].description;
            res.write(`<h1>The current temperature is: ${temp}</h1>`);
            res.write(`<h1>Description: ${description}</h1>`);
            res.send();
        });
    });
    
});

app.listen(3000,() => {
    console.log("Server started at port 3000");
});
