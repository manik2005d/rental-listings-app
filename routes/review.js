const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isAuthor, validateReview} = require("../middleware.js");

//Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req,res) =>{
    let {id} = req.params;
    let {comment, rating} = req.body;
    let listing = await Listing.findById(id);
    let newReview = new Review({
        comment,
        rating,
    });
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
router.delete("/:rid", isLoggedIn, isAuthor, wrapAsync(async (req,res) =>{
    await Review.findByIdAndDelete(req.params.rid);
    await Listing.findByIdAndUpdate(req.params.id,{ $pull: {reviews: req.params.rid} });
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${req.params.id}`);
}));

module.exports = router;