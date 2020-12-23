//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const moment = require('moment');
moment.locale('vi'); //set the location VietNam

cloudinary.config({
    cloud_name: 'mrend',
    api_key: '935971468737829',
    api_secret: 'BqEH96l0EZ5rM7bh1BxRexNcscY'
});


//Init database connection
mongoose.connect('mongodb+srv://mrend:171200@mrend-cluster.m2x8m.mongodb.net/mrend-blog?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + "/views"); //set view directory views
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static("public"));

const Girl = require('./model/girl');

//create middleware
app.use(async function(req, res, next) {
    res.locals = {
        moment: moment,
        girls: await Girl.getGirlList()
    };
    next();
});

app.get("/", (req, res) => {
    res.render("index", {});
})

//Controller
const userRouter = require('./router/user-router');
const girlRouter = require('./router/girl-router');
const blogRouter = require('./router/blog-router');
const aboutRouter = require('./router/about-router');
const contactRouter = require('./router/contact-router');
app.use('/user', userRouter);
app.use('/girl', girlRouter);
app.use('/blog', blogRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
});