const express = require("express");
const router = express.Router({mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const {valListingSchema, valReviewSchema} = require("../validationSchema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


const validateReview  = (req, res, next)=>{
    let {error} = valReviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}



// Reviews POST route
router.post("/", validateReview, wrapAsync(async(req, res)=>{

    console.log("review route hit");

    //accessing the lisintg using the id.   
    let listing = await Listing.findById(req.params.id);
    console.log(listing);


    let newReview = new Review(req.body.review) ;
    console.log("new review",newReview);

    //here "review" is from the "review form" which is present the "show.ejs"
    // where we name input and textarea as "review[rating] and review[comment]"

    // saving/puching newReivew in the "review" of the above fetched listing.
    listing.reviews.push(newReview);

    // saving new reviews
    await newReview.save();
    // saving/updating the listing with reviews.
    await listing.save();
    console.log("new review saved");
    
    req.flash("success", "Reivew added!");
    res.redirect(`/listings/${listing._id}`);
}))  ;


//Delete review route.
router.delete("/:reviewId", wrapAsync(async(req, res)=>{
    let{id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Reivew deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;