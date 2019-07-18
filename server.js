// Dependencies

var express = require("express");
var body = require("body-parser");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");
var cheerio = require("cheerio");


// Mongoose

var Note = require("./models/Note");
var Article = require("./models/Article");
var databaseUrl = 'mongodb://localhost/scrap';

if (process.env.MONGODB_URI) {
	mongoose.connect(process.env.MONGODB_URI);
}
else {
	mongoose.connect(databaseUrl)
		.then(()=>console.log("Database Connected"))
		.catch(error=>console.log("error: " ,error))
		
};

mongoose.Promise = Promise;
var db = mongoose.connection;

db.on("error", function(error) {
	console.log("Mongoose Error: ", error);
});

db.once("open", function() {
	console.log("Mongoose connection successful.");
});


var app = express();
var port = process.env.PORT || 3000;

// app set-ups

app.use(logger("dev"));
app.use(express.static("public"));
app.use(body.urlencoded({extended: false}));
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.listen(port, function() {
	console.log("Listening on port " + port);
})

// Routes