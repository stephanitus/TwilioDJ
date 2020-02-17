var express = require('express');
var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var pino = require('express-pino-logger')();
var bodyParser = require('body-parser');

var client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

var client_id = process.env.SPOTIFY_CLIENT_ID;
var client_secret = process.env.SPOTIFY_CLIENT_SECRET;
var redirect_uri = 'http://localhost:3001/callback';
var stateKey = 'spotify_auth_state';

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var app = express();
app.use(pino);
app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

app.get('/api/messages', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  let date = new Date((Date.now())-86400000);
  client.messages
        .list({
          dateSentAfter: date,
          to: process.env.TWILIO_PHONE_NUMBER
        })
        .then(msgs => res.send(JSON.stringify(msgs)));
});

app.delete('/api/messages', (req, res) => {
  client.messages
    .list()
    .then(msgs => msgs.forEach(msg => client.messages(msg.sid).remove()))
    .then(() => res.send(JSON.stringify('success')));
})

app.get('/login', (req, res) => {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  var scope = 'user-read-email user-modify-playback-state user-read-playback-state user-read-currently-playing playlist-modify-private playlist-read-private user-read-private streaming';
  //User login, send "code" to callback
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }))
});

app.get('/callback', (req, res) => {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if(state == null || state !== storedState){
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  }else{
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };
    //Grab code and retrieve tokens
    request.post(authOptions, (error, response, body) => {
      if(!error && response.statusCode === 200){
        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: {'Authorization': 'Bearer ' + access_token },
          json: true
        };
        //Test auth token
        request.get(options, (error, response, body) => {
          console.log(body);
        });
        //Send tokens to browser
        res.redirect('http://localhost:3000/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      }else{
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', (req, res) => {
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if(!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on 3001');
app.listen(3001);
