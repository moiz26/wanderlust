const mongoose =  require("mongoose");
const { type } = require("node:os");
const {Schema} = mongoose;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    }
});
userSchema.plugin(passportLocalMongoose); //model name.

module.exports =  mongoose.model("User", userSchema); 