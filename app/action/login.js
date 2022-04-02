const auth = require('../auth');

const login = (req, res) => {

  let seed = auth.getSeed();

  res.cookie('seed', seed, {httpOnly: true});
  console.log(['seed', seed]);

  res.render('login', {
    title: "login",
    challenge: `${seed}`,
    bot: `ozerobot1_bot`,
  });

}

module.exports = login;

/*

# Assume your Telegram bot authenticates & generates authorization url.

example: telegraf.js

- TELEGRAPH_SALT_1 is equal to process.env.SALT1
- user_verified = [ok|ng]

```
let ctx = JSON.parse(event.body);
let user_id = (ctx.message) ? ctx.message.chat.id : user_id;
let user_name = (ctx.update) ? ctx.update.chat.username : user_name;

bot.command('start', async (ctx) => {
  let seed = ctx.message.text;
  seed = (seed)?seed.replace("/start", "").replace(" ", ""):"";
  console.log(['/start', ctx, seed]);

  if(seed != ""){
    let guest = true;

    if(user_verified === "ok"){
      guest = false;
      let hash = sha256(user_data.user_id + seed + TELEGRAPH_SALT_1);
      console.log(["Login:", user_data.user_id, seed, TELEGRAPH_SALT_1, hash]);
      
      //
      let href = `https://[YOUR_TELEGRAPH_SERVER]/auth/${user_id}/${seed}/${hash}/${user_name}`;
      ctx.reply(`You're authorized. Now you can open the article.\n`, {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([ //button
          Markup.button.url('Open article', href)//text, callback-key
        ])
      })
    }

    //
    if(guest){
      ctx.reply('Members only.');
    }
    return;
  }
});
```


*/