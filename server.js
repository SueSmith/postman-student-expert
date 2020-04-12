// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
var bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

//receive new dream
app.post("/dream", (request, response) => { 
  if(request.get('secret')!==process.env.SECRET) 
    response.status(401).json({error: "Unauthorized - your secret needs to match the one on the server!"});
  else if(request.body.dream && request.body.dream!=null && request.body.dream.length>0) {
      dreams.push(request.body.dream);
      response.status(201).json({status: "Dream added", "dream": request.body.dream});
  }
  else
    response.status(400).json({error: "Bad request - please check your dream body data!"});
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
