const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer ({storage});

const listingController = require("../controllers/listings.js");

router.route("/")
//index route
.get(wrapAsync(listingController.index)) 
//b.Create(post) listing route
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    (req,res,next)=>{
        console.log("MULTER FILE =", req.file);
        next();
    },
    validateListing,
    wrapAsync(listingController.createListing)
);


// new form to Create 
// a.get the from to add listings
router.get("/new",
    isLoggedIn,
    listingController.addListingFrom );


router.route("/:id")
// show route = to show/return the data of specific listing.
.get(wrapAsync(listingController.showListing))
//update the listing route
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
)
// delete listing Route
.delete(
    isLoggedIn,
    isOwner, 
    wrapAsync(listingController.destroyListing));

router.get("/:id/edit",
    isLoggedIn,isOwner,
    wrapAsync(listingController.renderEditForm));


// INDEX ROUTE
// router.get("/", wrapAsync(listingController.index));

// // new form to Create 
// // a.get the from to add listings
// router.get("/new", isLoggedIn, listingController.addListingFrom );

//b.Create(post) listing
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));


// show route = to show/return the data of specific listing.
// router.get("/:id",  wrapAsync(listingController.showListing));

// Route to get/render the edit form
// router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Route to update the listing 
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// delete listing Route
// router.delete("/:id", isLoggedIn, isOwner,  wrapAsync(listingController.destroyListing));

module.exports = router;