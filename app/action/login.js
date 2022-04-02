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

