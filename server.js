// Dependencies

var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");
var cheerio = require("cheerio");
var request = require("request");
var app = express();
var port = process.env.PORT || 3000;

// Mongoose

const db = require("./models")
const databaseUri = process.env.MONGODB_URI || "mongodb://localhost/newsScraper"
mongoose.connect(databaseUri);

// app set-ups

app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({
	extended: true
}));
app.engine("handlebars", exphbs({
	defaultLayout: "main"
}));
app.set("view engine", "handlebars");
app.listen(port, function () {
	console.log("Listening on port " + port);
})

// Routes

app.get("/", function (req, res) {
	db.Article.find({}, function (err, data) {
		if (data.length === 0) {
			res.render("placeholder", {
				message: "There's nothing scraped yet. Click \"Scrape For Newest Articles\" for new articles!"
			});
		} else {
			res.render("index");
		}
	});
});

app.get("/scrape", function (req, res) {
	request("https://blogs.nasa.gov/", function (error, response, html) {
		const $ = cheerio.load(html);
		$("article").each((i, element)=> {
			let result = {};
			let link = $(element).find("a").attr("href");
			let title = $(element).find(".entry-title").text();
			let summary = $(element).find(".entry-content").text();
			
			result.link = link;
			result.title = title;
			result.summary = summary;
			
			// console.log(result);
			db.Article.create(result)
			.then((dbArticle)=>{
				console.log(dbArticle);
			
			}).catch((error)=>{
				console.log(error);
				
			})
		});
		console.log("Scrape finished.");
		res.send("Scrape Complete");
	});
});


app.post("/article", (req, res) => {
	console.log(db);

	const {
		URL,
		title,
		summary
	} = req.body;
	const newArticle = {
		URL,
		title,
		summary
	}
	db.Article.create(newArticle)
		.then(function (article) {
			console.log("Successfully added article")
			res.json(dbArticle);
		})
		.catch(function (err) {
			console.log("Error adding article");
			res.json(err);
		});
});

app.post("/note/:id", (req, res) => {
	console.log(db);

	const {
		articleID,
		comment
	} = req.body;
	const newNote = {
		articleID,
		comment
	}
	db.Note.create(newNote)
		.then(function (note) {
			console.log("Successfully added note")
			res.json(note);
		})
		.catch(function (err) {
			console.log("Error adding note");
			res.json(err);
		});
});