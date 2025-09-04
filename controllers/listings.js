const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.index = async(req, res) =>{
    let listings = await Listing.find();
    res.render("listings/index.ejs",{listings});
};

module.exports.renderNewForm = (req, res) =>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
    }else{
        res.render("listings/show.ejs",{listing});
    }
};

module.exports.createListing = async (req, res, next) =>{
    let {title, description, image, price, location, country} = req.body;
    await Listing.insertOne({
        title,
        description,
        image,
        price,
        location,
        country,
        owner: req.user._id,
    });
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
    }else{
        res.render("listings/edit.ejs",{listing});
    }
};

module.exports.updateListing = async (req, res, next) =>{
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
};

module.exports.destroyListing = async (req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    await Review.deleteMany({_id: {$in: listing.reviews}});
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};