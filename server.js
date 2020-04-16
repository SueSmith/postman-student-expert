// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
var bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//TODO include remix instructions for db init - works without calling any setup routes
//TODO people might arrive from glitch app, collection docs in browser, collection in pm
//TODO tip in first response, turn on save requests in history

// setup a new database
// persisted using async file storage
// Security note: the database is saved to the file `db.json` on the local filesystem.
// It's deliberately placed in the `.data` directory which doesn't get copied if someone remixes the project.
var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");
var adapter = new FileSync(".data/db.json");
var db = low(adapter);

// default cat list
db.defaults({
  cats: [
    { name: "Syd", humans: 17 },
    { name: "Hamish", humans: 3 },
    { name: "Peggy", humans: 5 }
  ]
}).write();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

//intro to course
app.get("/intro", (request, response) => {
  if (request.query.id) {
    response.status(200).json({
      title: "You sent a request with a query parameter!",
      info: [
        {
          note:
            "Your query parameter indicates that you want to retrieve some information with an id value of " +
            request.query.id +
            "."
        },
        {
          note:
            "You would use this to retrieve a particular piece of information from the API, for example a customer using their unique id."
        },
        {
          note:
            "Query parameters are included in the request address 'query string' and allow you to request specific information / services."
        }
      ],
      next:
        "Now try adding a path parameter. In the address, enter /:category before /intro then " +
        "in **Params**, enter a **Value** for the 'category' row e.g. 'hats' (without the quotes) and click **Send** again."
    });
  } else {
    response.status(200).json({
      title: "Welcome to the Learn by API course!",
      intro:
        "The requests will walk you through learning about APIs inside Postman. Click **Visualize** above this section to continue learning.",
      info: [
        {
          note: "You already sent an API request! 🎉 This is the JSON response."
        },
        {
          note:
            "Above you'll see the details of the request you sent. The address includes a base URL and a path '/intro' " +
            "- you made a request to the _endpoint_ at this location."
        },
        {
          note:
            "Notice to the right and above the response here that the API returned a **200 OK** status code - hover over it for more detail."
        },
        {
          note:
            "**Before you continue, in History on the left, switch on Save Responses so that you can look back at all of your requests.**"
        }
      ],
      next:
        "Now try a parameter - add ?id=1 to the end of the request address after /intro and click Send again."
    });
  }
});

//get with path
app.get("/:category/intro", (request, response) => {
  response.status(200).json({
    title: "You sent a path parameter!",
    info: [
      {
        note: "Path parameters form part of the request URL."
      },
      {
        note:
          "Anything you add in your address with a colon ':' in front of it will be treated as a path parameter in Postman."
      },
      {
        note:
          "Path parameters are similar to query string parameters in that you can use them to make requests for specific resources."
      }
    ],
    next:
      "Now change the method. Above, to the left of the address, click the drop-down to change **GET** to **POST**, " +
      "then click **Send** again."
  });
});

//post to path
app.post("/:category/intro", (request, response) => {
  if (request.body.message)
    response.status(201).json({
      title: "You sent body data!",
      next: "Now try opening the Manage Cats folder."
    });
  else {
    response.status(400).json({
      title: "You sent a post request!",
      info: [
        {
          note:
            "Post requests let you send data to the API, for example to add a new customer record for an online shop."
        },
        {
          note: "Post requests normally include body data indicating the information you want to add via the API, formatted in JSON or XML."
        },
        {
          note: "Notice that the status code is 400, this is because your body data is not yet complete."
        }
      ],
      next:
        "Now try adding some body data. In **Body** under the request address, select **raw**, "+
        "choose **JSON** from the drop-down list on the right. " +
        "Enter {'name':'mary'} into the text field."
    });
  }
});

//now in collections tab open learn by api and open cats

//get a single random cat
app.get("/cat", (request, response) => {
  var dbCats = [];
  var cats = db.get("cats").value(); // Find all cats in the collection
  response.status(200).json({
    info: "You made a GET request! The API responded with the following data:",
    cat: cats[Math.floor(Math.random() * cats.length)]
  });
});

//get all cats
app.get("/cats", (request, response) => {
  var dbCats = [];
  var cats = db.get("cats").value(); // Find all cats in the collection
  console.log(cats);
  response
    .status(200)
    .json({
      message:
        "This response includes an array—click Visualize above and then scroll to see it displayed as a chart",
      cats: cats
    });
});

//TODO make sure there are other error responses e.g. if request isn't matched

//protect everything after this by checking for the secret
app.use((req, res, next) => {
  const apiSecret = req.get("secret");
  if (!apiSecret || apiSecret !== process.env.SECRET) {
    res.status(401).json({
      error: "Unauthorized - your secret needs to match the one on the server!"
    });
  } else {
    next();
  }
});

// removes entries from users and populates it with default users
app.get("/reset", (request, response) => {
  // removes all entries from the collection
  db.get("cats")
    .remove()
    .write();
  console.log("Database cleared");

  // default users inserted in the database
  var cats = [
    { name: "Syd", humans: 17 },
    { name: "Hamish", humans: 3 },
    { name: "Peggy", humans: 5 }
  ];

  cats.forEach(cat => {
    db.get("cats")
      .push({ name: cat.name, humans: cat.humans })
      .write();
  });
  console.log("Default cats added");
  response.redirect("/");
});

// removes all entries from the collection
app.get("/clear", (request, response) => {
  // removes all entries from the collection
  db.get("cats")
    .remove()
    .write();
  console.log("Database cleared");
  response.redirect("/");
});

// creates a new entry in the users collection with the submitted values
app.post("/cat", (request, response) => {
  if (request.body.name && request.body.humans) {
    db.get("cats")
      .push({ name: request.body.name, humans: request.body.humans })
      .write();
    console.log("New cat inserted in the database");
    response.status(200).json({ status: "Cat added", cat: request.body });
  } else
    response
      .status(400)
      .json({ error: "Bad request - please check your cat body data!" });
});

//update cat human field
app.patch("/cat", (request, response) => {
  if (request.query.name && request.body.humans) {
    db.get("cats")
      .find({ name: request.query.name })
      .assign({ humans: request.body.humans })
      .write();
    response.status(201).json({
      status: "Updated",
      cat: request.query.name,
      humans: request.body.humans
    });
  } else
    response
      .status(400)
      .json({ error: "Bad request - please check your data!" });
});

//update entire cat
app.put("/cat", (request, response) => {
  if (
    request.query.current_name &&
    request.body.humans &&
    request.body.new_name
  ) {
    db.get("cats")
      .find({ name: request.query.current_name })
      .assign({ name: request.body.new_name, humans: request.body.humans })
      .write();
    response.status(201).json({
      status: "Updated",
      cat: request.query.new_name,
      humans: request.body.humans
    });
  } else
    response
      .status(400)
      .json({ error: "Bad request - please check your data!" });
});

//delete cat
app.delete("/cat", (request, response) => {
  if (request.query.name) {
    db.get("cats")
      .remove({ name: request.query.name })
      .write();
    response.status(200).json({ status: "Deleted", cat: request.query.name });
  } else
    response
      .status(400)
      .json({ error: "Bad request - please check your data!" });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
