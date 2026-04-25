const mongoose =  require("mongoose");
const { type } = require("node:os");
// const Schema = mongoose.Schema; (or you can write it as)
const {Schema} = mongoose;


const listingSchema = new Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true,
       
    },
    image:{
        filename:{
            type:String,
            default: "listingimage"
        },
        url:{
            type:String,
            default:"https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    },
    price:{
        type: Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;