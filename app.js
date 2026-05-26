if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;


const User = require("./models/user.js");


const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userLoginRouter = require("./routes/user.js")

// conecting  to mongoDB database
 const DB_URL = process.env.ATLASDB_URL;
 async function main() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to DB")
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

const store = MongoStore.create({
  mongoUrl: DB_URL,
  crypto:{
    secret: process.env.SECRET || "SecretKey",
    
  },
  touchAfter: 24 * 3600
});

store.on("error", (err)=>{
  console.log("ERROR IN MONGO SESSION STORE", err)
})

const sessionOptions = {
  store,
  secret: process.env.SECRET || "SecretKey",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 7 * 24 *60 * 60 * 1000, //one week
    maxAge: 7 * 24 *60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  }
};

app.use(session(sessionOptions));


app.use(passport.initialize());
app.use(passport.session()); 

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use((req, res, next) =>{
  res.locals.success = req.flash("success"); //save messages with the key "success"(Here in req.flash "success" is the key) in the req.locals.successs(here success is just a variable) 
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next(); //must call next else it will  stuck in this MW.
})


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/",userLoginRouter)


app.use((req,res,next)=>{
    next(new ExpressError(404, "Page Not Found!"));
});

//global error handler.
app.use((err,req, res, next)=>{
  console.log(err);
    let {statusCode = 500, message = "Something Went Wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message})
});

const port = process.env.PORT || 8080;

app.listen(port, () =>{
    console.log(`Server is running at ${port}`);
});