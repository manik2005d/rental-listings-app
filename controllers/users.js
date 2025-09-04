const User = require("../models/user.js");

module.exports.renderSignUpForm = (req,res) =>{
    res.render("users/signup.ejs");
};

module.exports.signup = async (req,res) =>{
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username})
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) =>{
            if(err){
                return next(err);
            }
            req.flash("success", "User registered successfully");
            res.redirect("/listings");
        });
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res) =>{
    res.render("users/login.ejs");
};

module.exports.login = async (req,res) =>{
    req.flash("success", "Welcome to WanderHub!");
    res.redirect("/listings");
};

module.exports.logout = (req,res) =>{
    req.logout((err) =>{
        if(err){
            next(err);
        }
        req.flash("success","Successfully Logged Out");
        res.redirect("/listings");
    });
};