const { strict } = require("assert");
const { default: mongoose, set } = require("mongoose");
const { type } = require("os");
let schema = mongoose.Schema;

let cycleschema = new schema({

});

let Cycle = mongoose.model("Cycle", cycleschema);

model.exports = Cycle;
