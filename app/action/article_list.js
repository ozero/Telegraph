const article = require('../model/article');
const sha256 = require('sha256');

const article_list = (req, res) => {
  //
  let c = (!req.cookies) ? {} : req.cookies;
  let user_id = (c.user_id)?c.user_id:"";
  let username = (c.username)?c.username:"";
  //
  //console.log(['article_list', c.user_id, obj._doc]);

  article.find({ user_id: c.user_id }).sort([['date', -1]]).exec(function(err, obj) { 
    //console.log(['article_list', user_id, obj]);
    res.render('article_list', {
      list:obj,
      article_user_id: user_id,
      article_user_name: username,
    });
  

  });


  // article.find({ user_id: c.user_id }, (err, obj) => {
  //   if ((obj === null)||(user_id === "")) {
  //     console.log(['ERROR:article_list', url, err]);
  //     res.render('article_list', {
  //       list:[],
  //       article_user_id: user_id,
  //       article_user_name: username,
  //     });

  //   } else {
  //     console.log(['article_list', user_id, obj]);
  //     res.render('article_list', {
  //       list:obj,
  //       article_user_id: user_id,
  //       article_user_name: username,
  //     });

  //   }
  // });

}

module.exports = article_list;

