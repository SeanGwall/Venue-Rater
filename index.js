const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Venue = require("./models/venue");

mongoose.connect('mongodb://localhost:27017/venue-rater');


const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database Online!");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/make-venue", async (req, res) => {
    const ven = new Venue({title: "First Venue"});
    await ven.save();
    res.send(ven);
})

app.get('/', (req, res) => {
    res.render("home");
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})