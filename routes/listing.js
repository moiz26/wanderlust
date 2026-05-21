const express = require("express");
const router = express.Router();
// const mongoose = require("mongoose")
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const { findById } = require("../models/review.js");

// INDEX ROUTE
router.get("/",wrapAsync( async (req,res) =>{
    const allListings = await Listing.find({}); //finding all the listings and sending/rendering them using index.ejs template
    res.render("listings/index.ejs",{allListings});
}));


// new form to Create 
// a.get the from to add listings
router.get("/new", isLoggedIn, (req,res) =>{
    res.render("listings/addListing.ejs");
});

//b.Create(post) listing
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req,res, next) =>{
    const newListing = req.body.listing;
    newListing.owner = req.user._id;
    console.log(newListing)
    await new Listing(newListing).save();
    req.flash("success", "New listing created!");
    res.redirect("/listings") ;
}));


// show route = to show/return the data of specific listing.
router.get("/:id",  wrapAsync(async (req,res) =>{
    let {id} = req.params;
    const listingData = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listingData){
        req.flash("error", "Could not find the lisitng");
         return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listingData});
}));

// Route to get/render the edit form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync( async (req,res) =>{
    let {id} = req.params;
    const listingData = await Listing.findById(id);
    if(!listingData){
        req.flash("error", "Could not find the lisitng");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listingData})
}));

// Route to update the listing 
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req,res) =>{
    let {id} = req.params;
    let  editData = req.body.listing;
    // Spread operator doesn’t work well with nested objects(EX "IMG" in our schema).
    // we have to manually structure image
    editData.image = {
        url: editData.image,
        filename: "listingimage"
    };
    await Listing.findByIdAndUpdate(id, editData,); 
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);

}));

// delete listing Route
router.delete("/:id", isLoggedIn, isOwner,  wrapAsync(async  (req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    if (!deletedListing) {
        return res.send("Listing not found ❌");
    };
    
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}));

module.exports = router;