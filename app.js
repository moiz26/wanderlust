const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// conecting  to mongoDB database
 const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
 async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.log("DB Connection Error:", err.message);
    process.exit(1); // stop server if DB fails
  }
}

main();

//setting view engine to ejs
app.set("view engine", "ejs");
// setting path to views folder
app.set("views", path.join(__dirname,"views"));
// to parse the data 
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); //to use put/delete method coz html form can handel only get and post requests.
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// INDEX ROUTE
app.get("/listings", async (req,res) =>{
    const allListings = await Listing.find({}); //finding all the listings and sending/rendering them using index.ejs template
    res.render("listings/index.ejs",{allListings});
})

// new form to Create 
// a.get the from to add listings
app.get("/listings/new", (req,res) =>{
    res.render("listings/addListing.ejs");
});
//b.Create(post) listing
app.post("/listings", async (req,res) =>{
    console.log(req.body);
    let newListing = req.body.listing;
    await new Listing(newListing).save();
    res.redirect("/listings");
});

// show route = to show/return the data of specific listing.
app.get("/listings/:id", async (req,res) =>{
    let {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){ //check if the id is vlaid or not
        return res.send("Invalid ID format");
    }
    const listingData = await Listing.findById(id);

    if(!listingData){ //checks if the listing with the is available or not
        return res.send("Listing not found");
    }
    res.render("listings/show.ejs",{listingData});
});

// Route to get/render the edit form
app.get("/listings/:id/edit", async (req,res) =>{
    let {id} = req.params;
    const listingData = await Listing.findById(id);
    res.render("listings/edit.ejs", {listingData})
});

// Route to update the listing 
app.put("/listings/:id", async (req,res) =>{
    let {id} = req.params;
    let  editData = req.body.listing;
    // Spread operator doesn’t work well with nested objects(EX "IMG" in our schema).
    // we have to manually structure image
    editData.image = {
        url: editData.image,
        filename: "listingimage"
    };
    await Listing.findByIdAndUpdate(id, editData,{
        new: true,
        runValidators: true
    }
    )
    res.redirect(`/listings/${id}`);

});

// delete Route
app.delete("/listings/:id",async  (req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    if (!deletedListing) {
        return res.send("Listing not found ❌");
    }
    res.redirect("/listings");
})

//route for test only
// app.get("/testListing", async (req,res) =>{
//     let sampleListing = new Listing({
//         title: "villa",
//         description: "new villa at hyderabad",
//         price: 10000,
//         location: "Hyderabad",
//         country: "india"
//     });
//     await sampleListing.save();
//     console.log("Sample listing is saved");
//     res.send("testing successful");
// });


app.listen(8080, () =>{
    console.log("Server is running at http://localhost:8080");
})