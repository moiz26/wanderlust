const mongoose =  require("mongoose");
const initdata = require("./data.js"); //requiring sampleListing data.
const Listing = require("../models/listing.js");

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

const initDB = async () => {
    await Listing.deleteMany({}); //deleting existing data from the database.
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}

initDB();