const User = require("../models/user");
const {v4:uuidv4} = require("uuid");
const {setUser} = require("../services/auth")
//handleUserSignUp function
async function handleUserSignUp(req, res) {
    const {name, email, password} = req.body;
    await User.create({
        name,
        email,
        password
    });

    return res.redirect("/");
};

//User login
async function handleUserLogin(req, res) {
    const {name, email, password} = req.body;
    const user = await User.findOne({email, password});
    
    //User does not exist
    if(!user){
        return res.render("login", {
            error: "Invalid username or password",
        });
    }

    //Once the user is authorized, create a session for it
    const sessionId = uuidv4();//sessionId is unique to every user, and is stored with user
    setUser(sessionId, user);
    res.cookie("uid",sessionId);//set cookie with session id
    return res.redirect("/");
};
module.exports = {
    handleUserSignUp,
    handleUserLogin,
};