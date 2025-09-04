const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {redirectUser} = require("../middleware.js");
const userController = require("../controllers/users.js");

router.get("/signup", userController.renderSignUpForm);

router.post("/signup", wrapAsync(userController.signup));

router.get("/login", userController.renderLoginForm);

router.post("/login", redirectUser,
    passport.authenticate("local", {
        failureRedirect: "/login", 
        failureFlash: true
    }), userController.login);

router.get("/logout", userController.logout);

module.exports = router;