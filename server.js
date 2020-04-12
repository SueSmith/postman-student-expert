// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
var bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//TODO require auth for db operations

// setup a new database
// persisted using async file storage
// Security note: the database is saved to the file `db.json` on the local filesystem.
// It's deliberately placed in the `.data` directory which doesn't get copied if someone remixes the project.
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('.data/db.json');
var db = low(adapter);

// default user list
db.defaults({ users: [
      {"firstName":"John", "lastName":"Hancock"},
      {"firstName":"Liz",  "lastName":"Smith"},
      {"firstName":"Ahmed","lastName":"Khan"}
    ]
  }).write();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/users", function (request, response) {
  var dbUsers=[];
  var users = db.get('users').value() // Find all users in the collection
  users.forEach(function(user) {
    dbUsers.push([user.firstName,user.lastName]); // adds their info to the dbUsers value
  });
  response.send(dbUsers); // sends dbUsers back to the page
});

// creates a new entry in the users collection with the submitted values
app.post("/users", function (request, response) {
  db.get('users')
    .push({ firstName: request.query.fName, lastName: request.query.lName })
    .write()
  console.log("New user inserted in the database");
  response.sendStatus(200);
});

// removes entries from users and populates it with default users
app.get("/reset", function (request, response) {
  // removes all entries from the collection
  db.get('users')
  .remove()
  .write()
  console.log("Database cleared");
  
  // default users inserted in the database
  var users= [
      {"firstName":"John", "lastName":"Hancock"},
      {"firstName":"Liz",  "lastName":"Smith"},
      {"firstName":"Ahmed","lastName":"Khan"}
  ];
  
  users.forEach(function(user){
    db.get('users')
      .push({ firstName: user.firstName, lastName: user.lastName })
      .write()
  });
  console.log("Default users added");
  response.redirect("/");
});

// removes all entries from the collection
app.get("/clear", function (request, response) {
  // removes all entries from the collection
  db.get('users')
  .remove()
  .write()
  console.log("Database cleared");
  response.redirect("/");
});

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
  else if(request.body.dream){
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
