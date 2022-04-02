const article = require('../model/article');

const jot = (req, res) => {
  let c = (!req.cookies) ? {} : req.cookies;

  // console.log(req.originalUrl, url, req.params);
  if (!req.params.id) {
    res.render('article', {
      title: "404",
      user_id: " - ",
      user_name: "not found",
      story: "見つかりません",
    });
  }
  //
  let url = req.params.id;

  res.cookie('entry_id', url, {
    httpOnly: true,
    secure: true,
  });

  article.findOne({ url: url }, (err, obj) => {
    if (obj === null) {
      console.log(['ERROR:jot', url, err]);
      res.render('jot', {
        article_id: "",
        title: "404",
        user_id: c.user_id,
        article_user_id: " - ",
        article_user_name: "not found",
        article_slug: "",
        story: "見つかりません",
      });

    } else {
      //console.log(['jot', url, obj._doc]);
      res.render('jot', {
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

}

module.exports = jot;

