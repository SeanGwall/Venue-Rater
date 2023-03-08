const nflJSON = require("./nfl-stadiums.json");
const mlbJSON = require("./mlb-stadiums.json");
const nhlJSON = require("./nhl-stadiums.json");
const Venue = require("../models/venue");
const mongoose = require("mongoose");

const clearDB = async () => await Venue.deleteMany({});

const fillNFL = async () => {
	for (feature of nflJSON.features) {
		const nflVenue = new Venue({
			name : feature.properties.Stadium,
			league : "NFL",
			team : feature.properties.Team
		})
		await nflVenue.save();
	}
}

const fillMLB = async () => {
	for (const [key, val] of Object.entries(mlbJSON)){
		const mlbVenue = new Venue({
			name : key,
			league : "MLB",
			team : val.team
		})
		await mlbVenue.save();
	}
}

const fillNHL = async () => {
	for (feature of nhlJSON.features) {
		const nhlVenue = new Venue({
			name : feature.properties.name,
			league : "NHL",
			team : feature.properties.team
		})
		await nhlVenue.save();
	}
	mongoose.connection.close();
}

mongoose.connect("mongodb://localhost:27017/venue-rater");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Filling DB with [NFL, MLB, NHL] data");
  clearDB();
  fillNFL();
  fillMLB();
  fillNHL();
});