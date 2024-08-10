const { strict } = require("assert");
const { default: mongoose, set } = require("mongoose");
const { type } = require("os");
let schema = mongoose.Schema;

let listingSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTE2MjI1MjI0NDQ0MzYzMjM4Mg%3D%3D/original/ae3426d1-fba4-44d4-bed2-690426f25f7a.jpeg?im_w=1440&im_q=highq",
        set: (v) => v === "" ? "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTE2MjI1MjI0NDQ0MzYzMjM4Mg%3D%3D/original/ae3426d1-fba4-44d4-bed2-690426f25f7a.jpeg?im_w=1440&im_q=highq" : v,
    },
    monthlycycle: [{
        month: String,
        crop: String,
        action: String,
    }],
    summarybycroptype: [{
        month: String,
        summry: String,
    }],
    additionaltips: {
        type: String,
    },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;