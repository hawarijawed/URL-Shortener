const express = require("express");
const path = require('path');// Built in module used for finding paths
const cookieParser = require("cookie-parser")
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const userRoute = require("./routes/user")
const staticRoute = require("./routes/staticRouter");
const {connectToMongoDB} = require("./connect");
const {restrictToLoggedInUserOnly, checkAuth} = require("./middlewares/auth");
const PORT = 8001;

const app = express();
connectToMongoDB("mongodb://localhost:xxxxx/URLshortner").then(()=>{
    console.log("MongoDB connected Successfully...");
});

//Setting up the ejs for the server side rendering
app.set("view engine","ejs");
app.set("views",path.resolve("./views")); //Telling the express that all the files for ejs are in the folder "./views"

//Midlewares
app.use(express.json());// to supporm json data
app.use(express.urlencoded({extended:false})); //to support form data
app.use(cookieParser());
//Routes
app.use("/url",restrictToLoggedInUserOnly,urlRoute); //adding middleware in between
app.use("/user", userRoute); //Go for user authentication
app.use("/",checkAuth,staticRoute);// UI part 
// app.use("/url/test", async(req, res)=>{
//     //Acessing all short urls from the database
//     const AllUrls = await URL.find({});
//     return res.render("home",{
//         urls:AllUrls,
//     });
// })
app.get("/:shortUrl", async (req, res)=>{
    const shortId = req.params.shortUrl;
    const entry  = await URL.findOneAndUpdate(
        {
        shortUrl:shortId,
    },{
        $push:{
            visitHistory:[{timestamp: Date.now()}],
        },
    });

    if (!entry) {
        // Handle the case where no matching URL was found
        return res.status(404).json({ error: "URL not found" });
    }
    res.redirect(entry.redirectedUrl);//redirects user to the url
});
app.listen(PORT, ()=>console.log(`Server started at port: ${PORT}`));
