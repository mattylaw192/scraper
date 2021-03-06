var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3001;
var app = express();


// handlebars set up
// var exphbs = require("express-handlebars");

// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

// var routes = require("./models/index.js");
// app.use(routes);


// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static("public"));


app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));







var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/searchengineland";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true});




app.get("/scrape", function (req, res) {
    axios.get("https://searchengineland.com/").then(function (response) {
        var $ = cheerio.load(response.data);

        $("article h2").each(function (i, element) {
            var result = {};

            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            console.log(result)

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });

        });
        res.send("Scrape Complete");
    });
});


app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});








// Server Launch
app.listen(PORT, function () {
    console.log("App running on port:" + PORT);
});