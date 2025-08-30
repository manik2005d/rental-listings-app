const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const validateListing = (req,res,next)=>{
    if (!req.body || Object.keys(req.body).length === 0){
        throw new ExpressError(400, "Send valid data for listing");
    }

    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

//All Route
router.get("/", wrapAsync(async(req, res) =>{
    let listings = await Listing.find();
    res.render("listings/index.ejs",{listings});
}));

//New listing Route
router.get("/new", (req, res) =>{
    res.render("listings/new.ejs");
});

//Read Route
router.get("/:id", wrapAsync(async(req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
    }else{
        res.render("listings/show.ejs",{listing});
    }
}));

//Create Route
router.post("/", validateListing, wrapAsync(async (req, res, next) =>{
    let {title, description, image, price, location, country} = req.body;
    await Listing.insertOne({
        title,
        description,
        image,
        price,
        location,
        country
    });
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
    }else{
        res.render("listings/edit.ejs",{listing});
    }
}));

//Update Route
router.put("/:id", validateListing, wrapAsync(async (req, res, next) =>{
    let {id} = req.params;
    let {title, description, image, price, location, country} = req.body;
    await Listing.findByIdAndUpdate(id,{
        title,
        description,
        image,
        price,
        location,
        country
    });
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id", wrapAsync(async (req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    await Review.deleteMany({_id: {$in: listing.reviews}});
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;