const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReveiw = async(req, res)=>{
    // console.log("review route hit");
    //accessing the lisintg using the id.   
    let listing = await Listing.findById(req.params.id);
    console.log(listing);
    let newReview = new Review(req.body.review) ;
    newReview.author = req.user._id;
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
};

module.exports.destroyReview = async(req, res)=>{
    let{id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Reivew deleted!");
    res.redirect(`/listings/${id}`);
};