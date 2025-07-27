const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

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

//All Route
app.get("/listings", wrapAsync(async(req, res) =>{
    let listings = await Listing.find();
    res.render("listings/index.ejs",{listings});
}));

//New listing Route
app.get("/listings/new", (req, res) =>{
    res.render("listings/new.ejs");
});

//Read Route
app.get("/listings/:id", wrapAsync(async(req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));

//Create Route
app.post("/listings", wrapAsync(async (req, res, next) =>{
    if (!req.body || Object.keys(req.body).length === 0){
        next(new ExpressError(400, "Send valid data for listing"));
    }
    if(!req.body.title){
        next(new ExpressError(400, "Title missing"));
    }
    if(!req.body.description){
        next(new ExpressError(400, "Description missing"));
    }
    if(!req.body.price){
        next(new ExpressError(400, "Price missing"));
    }
    if(!req.body.location){
        next(new ExpressError(400, "Location missing"));
    }
    if(!req.body.country){
        next(new ExpressError(400, "Country missing"));
    }

    let {title, description, image, price, location, country} = req.body;
    await Listing.insertOne({
        title,
        description,
        image: {url: image},
        price,
        location,
        country
    });
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
app.put("/listings/:id", wrapAsync(async (req, res, next) =>{
    let {id} = req.params;
    if (!req.body || Object.keys(req.body).length === 0){
        next(new ExpressError(400, "Send valid data for listing"));
    }
    if(!req.body.title){
        next(new ExpressError(400, "Title missing"));
    }
    if(!req.body.description){
        next(new ExpressError(400, "Description missing"));
    }
    if(!req.body.price){
        next(new ExpressError(400, "Price missing"));
    }
    // if(!req.body.image.url){
    //     next(new ExpressError(400, "Image URL missing"));
    // }
    if(!req.body.location){
        next(new ExpressError(400, "Location missing"));
    }
    if(!req.body.country){
        next(new ExpressError(400, "Country missing"));
    }
    let {title, description, image, price, location, country} = req.body;
    await Listing.findByIdAndUpdate(id,{
        title,
        description,
        image: {url: image},
        price,
        location,
        country
    })
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//Custom error throw
app.use((req, res, next) =>{
    throw new ExpressError(404,"Page not Found");
});

//Middleware
app.use((err, req, res, next) =>{
    let {statusCode=500, message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
})

//Server is listening
app.listen(8080, (req, res) =>{
    console.log("Server is listening at port 8080");
});