const cookieParser = require('cookie-parser')

const login_action = require('./action/login');
const jot_action = require('./action/jot');
const article_get_action = require('./action/article_get');
const article_save_action = require('./action/article_save');
const article_list_action = require('./action/article_list');
const auth = require('./auth');

const controller = (app) => {
  //
  app.use(cookieParser())

  //. 全てのリクエストに対して前処理
  app.use('/*', function (req, res, next) {
    let p = (!req.params) ? {} : req.params;
    let c = (!req.cookies) ? {} : req.cookies;
    
    //acl
    let is_public = false;
    is_public = (p['0'].slice(0,5) === "auth/")?true:is_public;
    is_public = (p['0'].slice(0,5) === "login")?true:is_public;
    is_public = (p['0'] === "favicon.ico")?true:is_public;

    //param
    let entry_id = (!is_public)?p['0'].replace("edit/", ""):"";

    //
    let is_authorized = auth.authorize(res, c.user_id, c.seed, c.hash, "", entry_id);
    
    //console.log([p, c, entry_id, is_public]);

    if(!is_authorized && !is_public){
      //ログイン画面にリダイレクト
      res.redirect('/login');
      return;
    }
    next();
  });

  //loginform
  app.get('/login', (req, res) => {
    login_action(req, res);
  });

  //authetication
  app.get('/auth/:user_id/:seed/:hash/:username', (req, res) => {
    //req.params.id
    let p = req.params;
    let c = (!req.cookies) ? {} : req.cookies;
    let result = auth.authorize(res, p.user_id, p.seed, p.hash, p.username, c.entry_id);
    console.log(["/auth/", p, c, result]);

    //
    if(c.entry_id){
      res.redirect(`/${c.entry_id}`);
    }else{
      res.redirect('/');
    }
  });

  //トップ画面で投稿画面
  app.get('/', function (req, res) {
    let c = (!req.cookies) ? {} : req.cookies;
    res.render('jot', {
      title: "＊＊＊＊のお知らせ",
      article_user_id: c.user_id,
      article_user_name: c.username,
      story: "<div>＊＊＊＊をやるよ！</div><ul><li>主催：</li><li>日時：</li><li>場所：</li></ul>",
      article_slug: "",
    });
  });

  //
  app.get('/favicon.ico', function (req, res) {
    res.sendStatus(204)
  });

  //article_list
  app.get('/list', (req, res) => {
    article_list_action(req, res);
  })
  
  //article_get
  app.get('/:id', (req, res) => {
    article_get_action(req, res);
  })

  //article_jot
  app.get('/edit/:id', (req, res) => {
    jot_action(req, res);
  })

  //article_save
  app.post('/', (req, res) => {
    article_save_action(req, res);
  });

}

module.exports = controller;
