const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {reviewSchema} = require("../schema.js");

const validateReview = (req,res,next)=>{
    if (!req.body || Object.keys(req.body).length === 0){
        throw new ExpressError(400, "Send valid data for review");
    }

    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

//Post Review Route
router.post("/", validateReview, wrapAsync(async (req,res) =>{
    let {id} = req.params;
    let {comment, rating} = req.body;
    let listing = await Listing.findById(id);
    let newReview = new Review({
        comment,
        rating,
    });
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
router.delete("/:rid", wrapAsync(async (req,res) =>{
    await Review.findByIdAndDelete(req.params.rid);
    await Listing.findByIdAndUpdate(req.params.id,{ $pull: {reviews: req.params.rid} });
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${req.params.id}`);
}));

module.exports = router;