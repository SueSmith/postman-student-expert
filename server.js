/*
POSTMAN API STARTER

This API works in conjunction with the API Starter collecction in Postman to walk you through API basics.
Import the collection into Postman and send a request to the setup endpoint to begin.

This Glitch app is based on hello-express and low-db.

Below you'll see the code for the endpoints in the API after some initial setup processing
  - each endpoint begins "app." followed by get, post, patch, put, or delete, then the endpoint path, e.g. /cat
*/

/*
response structure:

{
    welcome:
      "Welcome! Check out the 'data' object below to see the values returned by the API. Click **Visualize** to see the 'tutorial' data " +
      "for this request in a more readable view.",
    data: {
      cat: {
        name: "Syd",
        humans: 9
      }
    },
    tutorial: {
      title: "You did a thing! 🚀",
      intro: "Here is the _intro_ to this **lesson**...",
      steps: [
        {
          note: "Here is a step with `code` in it...",
          pic:
            "https://assets.postman.com/postman-docs/postman-app-overview-response.jpg",
          raw_data: {
            cat: {
              name: "Syd",
              humans: 9
            }
          }
        }
      ],
      next: [
      {
        step: "Now do this...",
        pic:
          "https://assets.postman.com/postman-docs/postman-app-overview-response.jpg",
        raw_data: {
          cat: {
            name: "Syd",
            humans: 9
          } 
        }
      }
      ]
    }
  }
*/

// server.js
// where your node app starts

const express = require("express");
var bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup a new database persisted using async file storage
// Security note: the database is saved to the file `db.json` on the local filesystem.
// It's deliberately placed in the `.data` directory which doesn't get copied if someone remixes the project.
var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");
var adapter = new FileSync(".data/db.json");
var db = low(adapter);

// default cat list
db.defaults({
  matches: [
    {
      id: 1,
      creator: "postman",
      matchType: "League Cup Semi Final",
      opposition: "United",
      date: "Wed Mar 24 2021 14: 00: 04 GMT+0000 (Coordinated Universal Time)",
      points: -1
    },
    {
      id: 2,
      creator: "postman",
      matchType: "League Cup Quarter Final",
      opposition: "City",
      date: "Thu Jan 30 2020 20: 50: 46 GMT+0000 (Coordinated Universal Time)",
      points: 3
    },
    {
      id: 3,
      creator: "postman",
      matchType: "Friendly",
      opposition: "Athletic",
      date: "Wed Jan 13 2021 23: 01: 26 GMT+0000 (Coordinated Universal Time)",
      points: -1
    }
  ]
}).write();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/training", (request, response) => {
  response.status(200).json({
    welcome:
      "Welcome to the Postman Student Expert training course! Check out the 'data' object below to see the values returned by this API request. " +
      "Click **Visualize** to see the 'tutorial' guiding you through next steps - do this for every request in the collection!",
    data: {
      course: "Postman Student Expert"
    },
    tutorial: {
      title: "Welcome to Postman Student Expert training! 🎒🎓",
      intro:
        "This API and the collection you imported into Postman will guide you through the steps required to become a student expert.",
      steps: [
        {
          note:
            "The request you sent to the student training API received a response including this data:",
          raw_data: {
            course: "Postman Student Expert"
          }
        },
        {
          note:
            "The responses will include JSON data that you can see in the **Body > Pretty** area. The **Visualize** view will show you this " +
            "more readable view of the 'tutorial' information in the response, including images that will help you understand each step."
        },
        {
          note:
            "Throughout the course, you will create, edit, and send requests inside Postman, and the responses will guide you onto next " +
            "steps. You will work through the requests in the collection folders, learning API and Postman skills along the way."
        }
      ],
      next: [
        {
          step:
            "Now get started by opening the next request `Get matches` and clicking **Send**.",
          pic:
            "https://assets.postman.com/postman-docs/postman-app-overview-response.jpg"
        }
      ]
    }
  });
});

app.get("/matches", (request, response) => {
  if (request.query.status) {
    var matches;
    if (!["played", "pending"].includes(request.query.status)) {
      //flesh this out to full response
      response
        .status(400)
        .json({ error: "Status must be `played` or `pending`" });
    } else if (request.query.status === "played") {
      matches = db
        .get("matches")
        .filter(o => o.points > -1)
        .value();
    } else if (request.query.status === "pending") {
      matches = db
        .get("matches")
        .filter(o => o.points < 0)
        .value();
    }
    response.status(200).json({
      welcome:
        "Hi! Check out the 'data' object below to see the values returned by the API. Click **Visualize** to see the 'tutorial' data " +
        "for this request in a more readable view.",
      data: {
        matches: matches
      },
      tutorial: {
        title: "You sent a request to filter the matches returned!",
        intro:
          "The `status` parameter specified `" +
          request.query.status +
          "` which filters based on whether a match has been played or not.",
        steps: [
          {
            note:
              "This is a typical use of a query parameter—where you are requesting more specific information than the general path. " +
              "The API returned the following data:",
            raw_data: {
              matches: matches
            }
          },
          {
            note:
              "Notice that the parameter is added to the request address as part of the query string (after the `?` and with the structure " +
              "`status=played`)—you could have several of these by preceding additional query parameters with `&`. This is a pattern you will see " +
              "in the web browser address bar as you navigate websites—APIs work the same way."
          },
          {
            note:
              "You can use different types of parameter with your requests as you will see in some of the requests you build next. " +
              "Before you move on, click **Save** in Postman to save the current state of your request."
          }
        ],
        next: [
          {
            step:
              "So far we've retrieved data from the API, but let's also add some new data. Add another request to the collection. In **Collections** " +
              "click the *...* on the **Student Expert** > **1. Begin training - Requests** folder and click **Add Request**. Enter the name '2. Add match' " +
              "and make sure the collection and folder are selected before you click **Save to...**. In the request URL, enter {{training-api}}/match and " +
              "select `POST` from the method drop-down list. Click **Send**.",
            pic:
              "https://assets.postman.com/postman-docs/postman-app-overview-response.jpg"
          }
        ]
      }
    });
  } else {
    var matches = db.get("matches").value();
    response.status(200).json({
      welcome:
        "Hi! Check out the 'data' object below to see the values returned by the API. Click **Visualize** to see the 'tutorial' data " +
        "for this request in a more readable view.",
      data: {
        matches: matches
      },
      tutorial: {
        title: "You sent a request to retrieve all matches for the team! 🎉",
        intro:
          "The demo API we're using for this course is a for a fictional sports team. The API manages match, player, and team data. " +
          "The request you just sent uses a `GET` which is for retrieving data.",
        steps: [
          {
            note:
              "Look at the request URL. It should look like this `{{training-api}}/matches`. The URL is partly made up from a variable, " +
              " referenced using double curly braces around `training-api` - hover over it to see the value, it's part of the collection."
          },
          {
            note:
              "Open the **Console** along the bottom of the Postman window to see the address the request sent to. You can click a request " +
              "in the Console to see the full detail of what happened when it sent - this is helpful when you're troubleshooting. Close and " +
              "open the Console area whenever you find it useful."
          },
          {
            note:
              "The request you sent to `/matches` returned the following data. It's an array of the matches currently in the database, " +
              "including a few data values for each match.",
            raw_data: {
              matches: matches
            }
          }
        ],
        next: [
          {
            step:
          "This request retrieved all matches, but you can also filter the matches using parameters. Open **Params** and enter a new Query " +
          "parameter, with `status` as the **Key** and `played` or `pending` as the **Value**.",
        pic:
          "https://assets.postman.com/postman-docs/postman-app-overview-response.jpg"
          }
          ]
      }
    });
  }
});

/*
//generic get error
app.get("/*", (request, response) => {
  response.status(400).json({
    error:
      "🚧Oops this isn't a valid endpoint! " +
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});*/

//protect everything after this by checking for the secret - protect reset and clear here, above req personal key for post put del
app.use((req, res, next) => {
  const apiSecret = req.get("match_key");
  if (!apiSecret) {
    res.status(401).json({
      title: "You got an unauthorized error response!",
      intro:
        "🚫Unauthorized - your secret needs to match the one on the server!",
      info: [
        {
          note: "tbc"
        }
      ],
      next: "tbc",
      pic: ""
    });
  } else if (apiSecret !== process.env.SECRET) {
    res.status(401).json({
      title: "You got an unauthorized error response!",
      intro:
        "🚫Unauthorized - your secret needs to match the one on the server!",
      info: [
        {
          note: "tbc"
        }
      ],
      next: "",
      pic: ""
    });
  } else {
    next();
  }
});

// removes entries from users and populates it with default users
app.get("/reset", (request, response) => {
  // removes all entries from the collection
  db.get("matches")
    .remove()
    .write();
  console.log("Database cleared");

  // default users inserted in the database
  var matches = [
    {
      id: 1,
      creator: "postman",
      matchType: "League Cup Semi Final",
      opposition: "United",
      date: "Wed Mar 24 2021 14: 00: 04 GMT+0000 (Coordinated Universal Time)",
      points: -1
    },
    {
      id: 2,
      creator: "postman",
      matchType: "League Cup Quarter Final",
      opposition: "City",
      date: "Thu Jan 30 2020 20: 50: 46 GMT+0000 (Coordinated Universal Time)",
      points: 3
    },
    {
      id: 3,
      creator: "postman",
      matchType: "Friendly",
      opposition: "Athletic",
      date: "Wed Jan 13 2021 23: 01: 26 GMT+0000 (Coordinated Universal Time)",
      points: -1
    }
  ];

  matches.forEach(match => {
    db.get("matches")
      .push({
        id: match.id,
        creator: match.creator,
        matchType: match.matchType,
        opposition: match.opposition,
        date: match.date,
        points: match.points
      })
      .write();
  });
  console.log("Default matches added");
  response.redirect("/");
});

// removes all entries from the collection
app.get("/clear", (request, response) => {
  // removes all entries from the collection
  db.get("matches")
    .remove()
    .write();
  console.log("Database cleared");
  response.redirect("/");
});

//errors
app.post("/*", (request, response) => {
  response.status(400).json({
    error:
      "🚧Oops this isn't a valid endpoint! " +
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});
app.put("/*", (request, response) => {
  response.status(400).json({
    error:
      "🚧Oops this isn't a valid endpoint! " +
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});
app.patch("/*", (request, response) => {
  response.status(400).json({
    error:
      "🚧Oops this isn't a valid endpoint! " +
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});
app.delete("/*", (request, response) => {
  response.status(400).json({
    error:
      "🚧Oops this isn't a valid endpoint! " +
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
