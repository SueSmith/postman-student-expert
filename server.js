// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
var bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

//get a single random cat
app.get("/cat", (request, response) => {
  if (request.query.humans) {
    //send back cat with most humans
    var cats = db
      .get("cats")
      .sortBy("humans")
      .value();
    if (request.query.humans === "most")
      response.status(200).json({ leading_cat: cats[cats.length - 1] });
    else if (request.query.humans === "least")
      response.status(200).json({ trailing_cat: cats[0] });
    else
      response
        .status(400)
        .json({
          error:
            "Oops! Check your 'humans' query parameter value—you passed '" +
            request.query.humans +
            "' but it should be either most or least."
        });
  } else {
    var cats = db.get("cats").value(); // Find all cats in the collection
    var randCat = cats[Math.floor(Math.random() * cats.length)];
    //TODO update link to correct collection
    response.status(200).json({
      title: "Welcome to the API Starter collection! 🎓🚀",
      init_note: "If you're using the API Starter template inside Postman - click **Visualize** for a much more informative view of this info!",
      intro: "This collection will walk you through learning the basics of API operations. You will call your API in Postman and make changes "+
      "to the API code itself on Glitch. **Before you start, make sure you have remixed the app on Glitch, imported the collection into "+
      "Postman, and updated your collection variables by "+
      "[following the instructions in the docs](https://explore.postman.com/templates/7499/learn-by-api).**",
      info: [
        {
          note:
            "You sent a request to retrieve a single cat from the database. "+
            "The API returned a random cat, including its name and the number of humans it has, like this:",
          json_content: {cat: randCat}
        },
        {
          note: "Notice above and to the right in Postman that the response returned a _200 OK_ **Status** code. "+
            "You can also see the response time and size—hover over them for more detail."
        },
        {
          note: "Before you continue, in the left, open **History** and make sure you have **Save Responses** switched on—"+
            "this will let you look back through your requests later. "+
            "**Save** your edits as you work on the requests using the button to the top right—"+
            "_you can import the collection again if you want to start over_."
        }
      ],
      next: "In your Glitch app, open the server.js file. "+
        "This is the app.get('/cat') request, which you'll see has an _if...else_ inside it."+
        " The if part checks to see if you sent a query parameter named 'humans' but in this case you didn't, "+
      "so it returned what's in the else. Next try adding the query param."
    });
  }
});

//get all cats
app.get("/cats", (request, response) => {
  var dbCats = [];
  var cats = db.get("cats").value(); // Find all cats in the collection
  console.log(cats);
  response.status(200).json({
    message:
      "This response includes an array—click Visualize above and then scroll to see it displayed as a chart",
    cats: cats
  });
});

//generic get error
app.get("/*", (request, response) => {
  response.status(400).json({
    error:
      "Oops this isn't a valid endpoint! "+
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});

//protect everything after this by checking for the secret
app.use((req, res, next) => {
  const apiSecret = req.get("cat_key");
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

//errors
app.post("/*", (request, response) => {
  response.status(400).json({
    error:
      "Oops this isn't a valid endpoint! "+
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});
app.put("/*", (request, response) => {
  response.status(400).json({
    error:
      "Oops this isn't a valid endpoint! "+
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});
app.patch("/*", (request, response) => {
  response.status(400).json({
    error:
      "Oops this isn't a valid endpoint! "+
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});
app.delete("/*", (request, response) => {
  response.status(400).json({
    error:
      "Oops this isn't a valid endpoint! "+
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
