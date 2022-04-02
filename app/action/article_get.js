const article = require('../model/article');
const sha256 = require('sha256');

const article_get = (req, res) => {
  //
  let c = (!req.cookies) ? {} : req.cookies;
  //
  let url = req.originalUrl.slice(1);
  article.findOne({ url: url }, (err, obj) => {
    if (obj === null) {
      console.log(['ERROR:article_get', url, err]);
      res.render('article', {
        article_id: "",
        title: "404",
        user_id: c.user_id,
        article_user_id: " - ",
        article_user_name: "not found",
        article_slug: "",
        story: "見つかりません",
      });

    } else {
      //console.log(['app.get', url, obj._doc]);
      res.render('article', {
        article_id: url,
        title: obj.title,
        user_id: c.user_id,
        article_user_id: obj.user_id,
        article_user_name: obj.user_name,
        article_slug: obj.slug,
        story: obj.story,
      });

    }
  });

  // db.articles.find({ "user_id" : "138586654"})

}

module.exports = article_get;

