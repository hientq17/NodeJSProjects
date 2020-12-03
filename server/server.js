const express = require('express') 
const app = express()
app.get("/",(request,response) =>{
    response.send('<h1>Hello World! Mrend here...</h1>');   
})
app.get("/contact",(request,response) =>{
    response.send('Contact my by email: nhochiennhoc@gmail.com');   
})
app.listen(3000, () => {
    console.log("Server started on port 3000");
});