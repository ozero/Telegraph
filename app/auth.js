
const sha256 = require('sha256');
const crypto = require('crypto');

const auth = {

  //チャレンジ
  getSeed: () => {
    const N = 6
    let seed = crypto.randomBytes(N).toString('base64').substring(0, N).replace("/", "*");
    return seed;
  },

  //認証
  authorize: (res, user_id, seed, hash, username, entry_id) => {

    // Cookieの[hash]を、Cookieの[user_id]と[seed]、それと[salt-1]から生成した値で検証する
    let calc = sha256(user_id + seed + process.env.SALT1);
    //console.log(["authorize", user_id, seed, process.env.SALT1, hash, calc]);

    //認可
    if(calc === hash){
      //問題なければCOOKIEを発行
      res.cookie("user_id", user_id, {httpOnly: true});
      res.cookie("seed", seed, {httpOnly: true});
      res.cookie("hash", hash, {httpOnly: true});
      if(username != ""){
        res.cookie("username", username, {httpOnly: true});
      }
      
      //ログイン遷移用のcookieは消しとく
      res.clearCookie("entry_id");
      return true;

    }else{
      //該当するcookieを削除
      res.clearCookie("user_id");
      res.clearCookie("seed");
      res.clearCookie("hash");
      res.clearCookie("username");

      //ログイン遷移用のcookieを設定
      if(entry_id != "") {
        res.cookie("entry_id", entry_id, {httpOnly: true});
      }

      return false;

    }
  },

  //getter
  getSession: () => {
    return {
      user_id: res.cookie.user_id,
      user_name: res.cookie.user_name
    };
  }

}

module.exports = auth;

/*

# 安全なチラ裏

## 起動

root で `node app.js`

## 識別・認証・認可

セッションストアをブラウザのcookieのみに持たせるのであれば。

### CMS

- CMSが未ログインでアクセスされる
  - cookieの[hash]を、Cookieの[user_id]と[seed]、それと[salt]から生成した値で検証する
  - アクセス先の記事名[entry_id]をcookieに入れる

- CMSはログイン画面を提示
  - アクセス時に[seed]を生成
  - [seed]をcookieに入れる

- TGでbotとの会話画面を開く
  - bot url `tg://resolve?domain=ozerobot1_bot&start=6A0NBX`
  - botに渡すコマンド `/start [seed]`


### Bot

- botは以下を判断する
  - 投げた人間の[user_id]がグループ「（メンバー名簿）」に居るかどうか

- 問題なければ [seed]と[salt]を元に[hash]を生成
  - botはログイン用URLを生成して発言
  - https://www.xm-xm.com:3001/auth/[user_id]/[seed]/[hash]/[username]


### CMS

- CMSは[hash]を、[user_id]と[seed]と[salt]から生成した値で検証する

- 問題なければCOOKIEを発行
  - [user_id]
  - [seed]
  - [hash]
  - [username]

- 記事表示ページにリダイレクトする
  - リダイレクト先の記事名[entry_id]をcookieから取得
  - cookieから[entry_id]を削除

- 以降、CMSは以下を検証してログイン状態を判断する
  - cookieの[hash]を、Cookieの[user_id]と[seed]、それと[salt]から生成した値で検証する
  - 正しければ、[user_id]と[username]を投稿に使用する

*/