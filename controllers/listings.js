const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res) =>{
    const allListings = await Listing.find({}); //finding all the listings and sending/rendering them using index.ejs template
    res.render("listings/index.ejs",{allListings});
};

module.exports.addListingFrom = (req,res) =>{
    res.render("listings/addListing.ejs");
};

module.exports.createListing = async (req,res, next) =>{
    let newListing = new Listing(req.body.listing);
    
    if(req.file){
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        }
    }
    newListing.owner = req.user._id;

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()
    newListing.geometry = response.body.features[0].geometry;
    
    let savedListing = await newListing.save();
    console.log(savedListing)
    req.flash("success", "New listing created!");
    res.redirect(`/listings/${savedListing._id}`) ;
};

module.exports.showListing = async (req,res) =>{
    let {id} = req.params;
    const listingData = await Listing.findById(id)
        .populate({
            path:"reviews",
            populate:{
                path: "author",
            },
        })
        .populate("owner");
    if(!listingData){
        req.flash("error", "Could not find the lisitng");
         return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listingData});
};

module.exports.renderEditForm = async (req,res) =>{
    let {id} = req.params;
    const listingData = await Listing.findById(id);
    if(!listingData){
        req.flash("error", "Could not find the lisitng");
        return res.redirect("/listings");
    }
    let originalImageUrl = listingData.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250")
    res.render("listings/edit.ejs", {listingData, originalImageUrl})
};

module.exports.updateListing = async (req,res) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing }
    );

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };

        await listing.save();
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async  (req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    if (!deletedListing) {
        return res.send("Listing not found ❌");
    };
    
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};