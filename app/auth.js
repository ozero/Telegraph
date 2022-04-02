
const sha256 = require('sha256');
const crypto = require('crypto');

/*
  const user_id = (!cookies.user_id)?"":cookies.user_id;
  const user_name = (!cookies.user_name)?"":cookies.user_name;
  const seed = (!cookies.seed)?"":cookies.seed;
  const login = (!cookies.login)?"":cookies.login;
  const hash2 = (!cookies.hash2)?"":cookies.hash2;
*/

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

- CMSが未ログインでアクセスされる
- CMSはログイン画面を提示
  - アクセス時の[seed]と[salt-1]の.slice(8.16)を元に[saltedhash-1]を生成
  - bot url
  - botに渡すコマンド textbox `/login [seed]_[saltedhash-1]`

- TGでbotとの会話画面を開く
- botにコマンドを投げる `/login [seed]_[saltedhash-1]`
- botは以下を判断する
  - 投げた人間の[user_id]がグループ「関西全体」に居るかどうか
  - [seed] が現在時刻から前後10分以内かどうか
  - [saltedhash-1]を、[seed]と[salt-1]から生成した値で検証する

- 問題なければ [user_id]と[seed]と[salt-2]を元に[saltedhash-2]を生成
  - botはログイン用URLを生成して発言
  - https://www.xm-xm.com:3001/login?[user_id]:[seed]:[saltedhash-2]:[user_name]

- CMSは[saltedhash-2]を、[user_id]と[seed]と[salt-2]から生成した値で検証する

- 問題なければCOOKIEを発行
  - login: ok
  - [user_id]
  - [user_name]
  - [seed]
  - [saltedhash-2]

- 以降、CMSは以下を検証してログイン状態を判断する
  - [saltedhash-2]を、[user_id]と[seed]と[salt-2]から生成した値で検証する
  - 正しければ、[user_id]と[user_name]を投稿に使用する


*/