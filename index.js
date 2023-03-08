const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Venue = require("./models/venue");

mongoose.connect("mongodb://localhost:27017/venue-rater");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
	console.log("Database Online!");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/make-venue", async (req, res) => {
	const ven = new Venue({ title: "First Venue" });
	await ven.save();
	res.send(ven);
});

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/venues", async (req, res) => {
	const venues = await Venue.find({});
	res.render("venues/index", { venues });
});

app.get("/venues/new", (req, res) => {
	res.render("venues/new");
});

app.post("/venues", async (req, res) => {
	const venue = new Venue(req.body.venue);
	await venue.save();
	res.redirect(`/venues/${venue.id}`);
});

app.get("/venues/:id", async (req, res) => {
	const venue = await Venue.findById(req.params.id);
	res.render("venues/show", { venue });
});

app.get("/venues/:id/edit", async (req, res) => {
	const venue = await Venue.findById(req.params.id);
	res.render("venues/edit", { venue });
});

app.put("/venues/:id", async (req, res) => {
	const { id } = req.params;
	const venue = await Venue.findByIdAndUpdate(id, { ...req.body.venue });
	res.redirect(`/venues/${venue._id}`);
});

app.delete("/venues/:id", async (req, res) => {
	const { id } = req.params;
  await Venue.findByIdAndDelete(id);
  res.redirect("/venues");
});

app.listen(3000, () => {
	console.log("Listening on port 3000");
});
