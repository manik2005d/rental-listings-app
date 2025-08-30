const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js")

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

main()
    .then(res => console.log("Conneceted to DB."))
    .catch(err => console.log(err));

//Home Route
app.get("/", (req, res) =>{
    res.send("Home Page");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

//Custom error throw
app.use((req, res, next) =>{
    next(new ExpressError(404,"Page not Found"));
});

//Error handling Middleware
app.use((err, req, res, next) =>{
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
});

//Server is listening
app.listen(8080, (req, res) =>{
    console.log("Server is listening at port 8080");
});