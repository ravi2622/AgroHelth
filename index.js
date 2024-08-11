let express = require("express");
let app = express();
let port = 8080;
let path = require("path");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const User = require("./models/user.js");
const Qustion = require("./models/qustion.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const mongoose = require('mongoose');
const { appendFileSync } = require("fs");

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

let isLoggdIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log(req.originalUrl);
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

let saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
};

const sesstionOpstion = {
    secret: 'mysupersecretstring',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 24 * 3,
        httpOnly: true
    },
};

app.use(session(sesstionOpstion));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;

    // console.log(res.locals.success);
    // console.log(res.locals.error);

    next();
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


app.get("/singnup", (req, res) => {
    res.render("./users/singnup.ejs");
});

app.post("/singnup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });

        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/soillisting");
        });

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/singnup");
    }
}));

app.get("/login", (req, res) => {
    res.render("./users/login.ejs");
});

app.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), wrapAsync(async (req, res) => {
    console.log(req.user);
    req.flash("success", "Welcome to Wanderlust! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/soillisting";
    res.redirect(redirectUrl);
}));

app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logged you out");
        res.redirect("/soillisting");
    });
});

app.get("/qustions", async (req, res) => {
    let Qustions = await Qustion.find().populate("from");
    console.log(await Qustion.find());
    // res.send(Qustions);
    res.render("./qustion/qustion.ejs", { Qustions });
});

app.get("/qustions/newqustion", (req, res) => {
    res.render("./qustion/newqustion.ejs");
});

app.post("/qustions", async (req, res) => {
    let { qustion } = req.body;

    console.log(qustion);

    // let from = await User.

    res.redirect("/qustions");
});