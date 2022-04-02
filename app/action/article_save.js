const article = require('../model/article');
const sha256 = require('sha256');
const crypto = require('crypto');

const article_save = (req, res) => {
  //generate url
  const N = 6
  let slug = crypto.randomBytes(N).toString('base64').substring(0, N);
  slug = slug.replace("/", "*").replace("+", "-").replace("=", "_");//url-safe
  slug = (req.body.slug != "")?req.body.slug:slug;

  let url = [
    new Date().toISOString().split('T')[0],
    req.body.user_id,
    slug
  ].join("_");

  //delete old one
  article.findOneAndRemove({ url: url }, (err, obj) => {
    //console.log(['app.findOneAndRemove', url, obj, err]);
  });

  //insert article
  let entry = article({
    title: req.body.title,
    user_id: req.body.user_id,
    user_name: req.body.user_name,
    story: req.body.story,
    date: new Date(),
    slug: slug,
    url: function () {
      this.url = url;
      return this;
    },
  }.url());
  entry.save((err) => {
    if (!err) {
      console.log(['New entry saved successfully.', entry, slug])
    } else {
      //console.log(['ERROR: controller:app.article()', err])
    }
  });
  res.redirect('/' + entry.url)
}

module.exports = article_save;

