const Listing = require("./models/listing");
const Review = require("./models/review.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in");
        res.redirect("/login");
    }else{
        next();
    }
}

const redirectUser = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

const isOwner = async (req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

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

const isAuthor = async (req,res,next) =>{
    let {id, rid} = req.params;
    let review = await Review.findById(rid);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports = {isLoggedIn, redirectUser, isOwner, validateListing, validateReview, isAuthor};