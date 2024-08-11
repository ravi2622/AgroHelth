const { strict } = require("assert");
const { object, string } = require("joi");
const { default: mongoose, set } = require("mongoose");
const { type } = require("os");
let schema = mongoose.Schema;

const qustionschema = new mongoose.Schema({
    from: {
        type: schema.Types.ObjectId,
        ref: "User",
    },
    qustion: {
        type: String,
        maxLength: 50,
    },
    created_at: {
        type: Date,
        require: true,
    },
});

const Qustion = new mongoose.model("Qustin", qustionschema);

module.exports = Qustion;