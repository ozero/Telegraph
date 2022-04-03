const article = require('../model/article');
const sha256 = require('sha256');

const article_list = (req, res) => {
  //
  let c = (!req.cookies) ? {} : req.cookies;
  let user_id = (c.user_id)?c.user_id:"";
  let username = (c.username)?c.username:"";

  article.find({ user_id: c.user_id }).sort([['date', -1]]).exec(function(err, obj) { 
    //console.log(['article_list', user_id, obj]);
    res.render('article_list', {
      list:obj,
      article_user_id: user_id,
      article_user_name: username,
      site_title: process.env.SITE_TITLE,
    });  

  });

}

module.exports = article_list;

