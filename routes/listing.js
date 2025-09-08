const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


//Index Route
router.get("/", wrapAsync(listingController.index));

//New listing Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Read Route
router.get("/:id", wrapAsync(listingController.showListing));

//Create Route
router.post("/", isLoggedIn, upload.single('image'), validateListing, wrapAsync(listingController.createListing));

//Edit Route
router.get("/:id/edit", isLoggedIn ,wrapAsync(listingController.renderEditForm));

//Update Route
router.put("/:id", isLoggedIn, isOwner, upload.single('image'), validateListing, wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/:id", isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;