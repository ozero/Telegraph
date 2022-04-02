const mongoose = require('mongoose')

let Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId

let ArticleSchema = new Schema({
    articleId       : ObjectId,
    title        : String,
    user_id      : {type: String, max: 100},
    user_name    : {type: String, max: 100},
    story        : String,
    date         : {type: Date, default: Date.now},
    slug         : String,
    url          : String
});

let Article = mongoose.model('Article', ArticleSchema)
module.exports = Article

