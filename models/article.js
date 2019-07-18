const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: String,
    summary: String,
    URL: String
});

const Article = mongoose.model("Article", ArticleSchema);

module.export = Article;