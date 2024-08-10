let express = require("express");
let app = express();
let port = 8080;
let path = require("path");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const mongoose = require('mongoose');

main().then(res => console.log("Connecstion Successful"))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/AgroHelth');
};

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.listen(port, (req, res) => {
    console.log(`The port will be listune at port - '${port}'`);
});

app.get("/", (req, res) => {
    res.send("welcome to the wanderlust :)");
});

app.get("/soillisting", async (req, res) => {
    let allListings = await Listing.find();
    res.render("./listings/index.ejs", { allListings });
});

app.get("/soillisting/:id", async (req, res) => {
    let { id } = req.params;
        console.log(id);
        const listing = await Listing.findById(id);
        console.log(listing);
        res.render("./listings/show.ejs", { listing });
});