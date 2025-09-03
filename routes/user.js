const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const {redirectUser} = require("../middleware.js");

router.get("/signup", (req,res) =>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req,res) =>{
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
}));

router.get("/login", (req,res) =>{
    res.render("users/login.ejs");
});

router.post("/login", redirectUser,
    passport.authenticate("local", {
        failureRedirect: "/login", 
        failureFlash: true
    }) ,
    async (req,res) =>{
    req.flash("success", "Welcome to WanderHub!");
    if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl);
    }else{
        res.redirect("/listings");
    }
});

router.get("/logout", (req,res) =>{
    req.logout((err) =>{
        if(err){
            next(err);
        }
        req.flash("success","Successfully Logged Out");
        res.redirect("/listings");
    });
});

module.exports = router;