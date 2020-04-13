// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
var bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//TODO require auth for db operations - see gh to protect following routes
//TODO include remix instructions for db init - works without calling any setup routes
//TODO people might arrive from glitch app, collection docs in browser, collection in pm
//TODO tip in first response, turn on save requests in history

// setup a new database
// persisted using async file storage
// Security note: the database is saved to the file `db.json` on the local filesystem.
// It's deliberately placed in the `.data` directory which doesn't get copied if someone remixes the project.
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('.data/db.json');
var db = low(adapter);

// default cat list
db.defaults({ cats: [
      {"name":"Syd", "humans":17},
      {"name":"Hamish",  "humans":3},
      {"name":"Peggy","humans":5}
    ]
  }).write();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/cats", (request, response) => {
  var dbCats=[];
  var cats = db.get('cats').value() // Find all users in the collection
  cats.forEach(function(cat) {
    dbCats.push({"name":cat.name,"humans":cat.humans}); // adds their info to the dbUsers value
  });
  response.send(dbCats); // sends dbUsers back to the page
});

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

//protect everything after this
app.use((req, res, next) => {
  const apiSecret = req.get('secret');
  if (!apiSecret || apiSecret !== process.env.SECRET) {
    res.status(401).json({error: 'Unauthorized - your secret needs to match the one on the server!'});
  } else {
    next();
  }
});


// removes entries from users and populates it with default users
app.get("/reset", (request, response) => {
  // removes all entries from the collection
  db.get('cats')
  .remove()
  .write()
  console.log("Database cleared");
  
  // default users inserted in the database
  var cats= [
      {"name":"Syd", "humans":17},
      {"name":"Hamish",  "humans":3},
      {"name":"Peggy","humans":5}
  ];
  
  cats.forEach((cat)=>{
    db.get('cats')
      .push({ name: cat.name, humans: cat.humans })
      .write()
  });
  console.log("Default cats added");
  response.redirect("/");
});

// removes all entries from the collection
app.get("/clear", (request, response) => {
  // removes all entries from the collection
  db.get('cats')
  .remove()
  .write()
  console.log("Database cleared");
  response.redirect("/");
});

// creates a new entry in the users collection with the submitted values
app.post("/cats", (request, response) => {
  if(request.body.name && request.body.humans){
    db.get('cats')
      .push({ name: request.body.name, humans: request.body.humans })
      .write()
    console.log("New cat inserted in the database");
    response.status(200).json({status: "Cat added", "dream": request.body});
  }
  else
    response.status(400).json({error: "Bad request - please check your cat body data!"});
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
