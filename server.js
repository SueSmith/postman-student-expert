/*
POSTMAN STUDENT EXPERT

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
const shortid = require("shortid");
//email validation
var validator = require("email-validator");

// default list
db.defaults({
  matches: [
    {
      id: shortid.generate(),
      creator: "postman",
      matchType: "League Cup Semi Final",
      opposition: "United",
      date: "Wed Mar 24 2021 14: 00: 04 GMT+0000 (Coordinated Universal Time)",
      points: -1
    },
    {
      id: shortid.generate(),
      creator: "postman",
      matchType: "League Cup Quarter Final",
      opposition: "City",
      date: "Thu Jan 30 2020 20: 50: 46 GMT+0000 (Coordinated Universal Time)",
      points: 3
    },
    {
      id: shortid.generate(),
      creator: "postman",
      matchType: "Friendly",
      opposition: "Athletic",
      date: "Wed Jan 13 2021 23: 01: 26 GMT+0000 (Coordinated Universal Time)",
      points: -1
    }
  ],
  calls: []
}).write();

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  var newDate = new Date();
  db.get("calls")
    .push({
      when: newDate.toDateString() + " " + newDate.toTimeString(),
      where: "GET /",
      what: req.get("match_key")
    })
    .write();
  if (req.headers["user-agent"].includes("Postman"))
    res.status(200).json({
      
      tutorial: {
        title: process.env.PROJECT,
        intro:
        "Use the " +
        process.env.PROJECT +
        " template in Postman to learn API basics! Import the collection in Postman by clicking " +
        "New > Templates, and searching for '" +
        process.env.PROJECT +
        "'. Open the first request in the collection and click Send. " +
        "To see the API code navigate to https://glitch.com/edit/#!/" +
        process.env.PROJECT_DOMAIN +
        " in your web browser!"
      }
    });
  else
    res.send(
      "<h1>" +
        process.env.PROJECT +
        "</h1><p>Oh, hi! There's not much to see here - view the code instead:</p>" +
        '<script src="https://button.glitch.me/button.js" data-style="glitch"></script><div class="glitchButton" style="position:fixed;top:20px;right:20px;"></div>'
    );
});

//generic welcome message
var welcomeMsg =
  "You're using the " +
  process.env.PROJECT +
  " training course! Check out the 'data' object below to see the values returned by this API request. " +
  "Click **Visualize** to see the 'tutorial' guiding you through next steps - do this for every request in the collection!";
//admin unauthorized
var unauthorizedMsg = {
  welcome: welcomeMsg,
  tutorial: {
    title: "Your request is unauthorized! 🚫",
    intro: "This endpoint requires admin authorization.",
    steps: [
      {
        note: "This endpoint is only accessible to admins for the API."
      }
    ],
    next: [
      {
        step: "Use the admin key indicated in the project env as secret."
      }
    ]
  }
};

//intro
app.get("/training", (req, res) => {
  var newDate = new Date();
  db.get("calls")
    .push({
      when: newDate.toDateString() + " " + newDate.toTimeString(),
      where: "GET /training",
      what: req.get("match_key")
    })
    .write();
  res.status(200).json({
    welcome: welcomeMsg,
    data: {
      course: process.env.PROJECT
    },
    tutorial: {
      title: "Welcome to " + process.env.PROJECT + " training! 🎒🎓",
      intro:
        "This API and the collection you imported into Postman will guide you through the steps required to become a student expert.",
      steps: [
        {
          note:
            "The request you sent to the student training API received a response including this data:",
          raw_data: {
            course: process.env.PROJECT
          }
        },
        {
          note:
            "The responses will include JSON data that you can see in the **Body > Pretty** area. The **Visualize** view will show you a " +
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
            "This folder has two requests in it—open the next one `1. Get matches`, look at the address, then come back to this one."
        },
        {
          step:
            "Both requests use the same **base** URL `" +
            process.env.PROJECT_DOMAIN +
            ".glitch.me`—instead of repeating this in every request, let's " +
            "store it in a variable and reuse the value. In the 'Student expert' collection on the left, click **...** > **Edit**. In " +
            "**Variables** add a new entry, with `training-api` in the **Variable** column and `" +
            process.env.PROJECT_DOMAIN +
            ".glitch.me` " +
            "for both **Initial** and **Current Value**. Click **Update**. (We'll be working with other variables later.)",
          pic:
            "https://assets.postman.com/postman-docs/student-expert-edit-var.jpg"
        },
        {
          step:
            "In the request builder, edit the address, replacing `postman-student-expert.glitch.me` with `{{training_api}}`—this is how we " +
            "reference variables in requests. Click **Send** to make sure the request still behaves the same way and scroll back here.",
          pic:
            "https://assets.postman.com/postman-docs/student-expert-url-var.jpg"
        },
        {
          step:
            "Before you move on click **Save** to save your request edits. Now open the next request in the collection `Get matches` and do " +
            "the same for the URL in there, replacing the base part of address with the variable reference—it should now be " +
            "`{{training_api}}/matches`. Click **Send** on the `Get matches` request and remember " +
            "to open the **Visualizer** on the response."
        }
      ]
    }
  });
});

app.get("/matches", (req, res) => {
  const apiSecret = req.get("match_key");
  var newDate = new Date();
  db.get("calls")
    .push({
      when: newDate.toDateString() + " " + newDate.toTimeString(),
      where: "GET /matches",
      what: req.query.status + " " + apiSecret
    })
    .write();
  if (req.query.status) {
    var matches;
    if (!["played", "pending"].includes(req.query.status)) {
      res.status(400).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "Your request is incomplete! ✋",
          intro: "Status must be `played` or `pending`!",
          steps: [
            {
              note:
                "Open **Params** and enter `played` or `pending` as the **Value** for the parameter with `status` as the **Key**. " +
                "You will see the query parameter added to the end of the request address e.g. `/matches?status=pending`."
            }
          ],
          next: [
            {
              step:
                "With a valid parameter value in place, click **Send** again."
            }
          ]
        }
      });
    } else if (req.query.status === "played") {
      matches = db
        .get("matches")
        .filter(o => o.points > -1)
        .filter(o => o.creator === "postman" || o.creator === apiSecret)
        .value();
    } else if (req.query.status === "pending") {
      matches = db
        .get("matches")
        .filter(o => o.points < 0)
        .filter(o => o.creator === "postman" || o.creator === apiSecret)
        .value();
    }
    res.status(200).json({
      welcome: welcomeMsg,
      data: {
        matches: matches
      },
      tutorial: {
        title: "You sent a request to filter the matches returned!",
        intro:
          "The `status` parameter specified `" +
          req.query.status +
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
              "You could have several query parameters, all of which will be appended to your request address by preceding each with" +
              "`&` e.g. `/matches?status=pending&team=United`. This is a pattern you will see in the web browser address bar when you navigate " +
              "websites—APIs work the same way."
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
              "click the *...* on the **Student Expert** > **1. Begin training - Requests** folder and click **Add Request**.",
            pic:
              "https://assets.postman.com/postman-docs/student-expert-add-request.jpg"
          },
          {
            step:
              "Enter the name '2. Add match' and make sure the correct collection and folder are selected before you click **Save to...**.",
            pic:
              "https://assets.postman.com/postman-docs/student-expert-request-name.jpg"
          },
          {
            step:
              "The new request will appear in the collection folder on the left—click to open it in the request builder. In the request URL, " +
              "enter `{{training_api}}/match` and select `POST` from the method drop-down list. Click **Send**.",
            pic:
              "https://assets.postman.com/postman-docs/student-expert-post-url.jpg"
          }
        ]
      }
    });
  } else {
    var matches = db
      .get("matches")
      .filter(m => m.creator === "postman" || m.creator === apiSecret)
      .value();
    res.status(200).json({
      welcome: welcomeMsg,
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
              "parameter, with `status` as the **Key** and `played` or `pending` as the **Value**. You will see the query parameter added to " +
              "the end of the request address e.g. `/matches?status=pending`. Click **Send** again.",
            pic:
              "https://assets.postman.com/postman-docs/student-expert-add-query.jpg"
          }
        ]
      }
    });
  }
});

app.post("/match", (req, res) => {
  const apiSecret = req.get("match_key");
  var newDate = new Date();
  db.get("calls")
    .push({
      when: newDate.toDateString() + " " + newDate.toTimeString(),
      where: "POST /match",
      what: req.body.match + " " + apiSecret
    })
    .write();
  console.log(apiSecret);
  if (!apiSecret || apiSecret.length < 1 || apiSecret.startsWith("{")) {
    res.status(401).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Oops - You got an unauthorized error response! 🚫",
        intro:
          "When you're sending new data to the API, you will typically need to authorize your requests.",
        steps: [
          {
            note:
              "You're going to add an auth key to this request, but instead of entering it manually let's use a variable—this helps " +
              "minimize visibility of what could be sensitive credentials. Open the **Authorization** tab for the request—select " +
              "`Inherit auth from parent` from the **Type** drop-down list.",
            pic:
              "https://assets.postman.com/postman-docs/student-expert-inherit-auth.jpg"
          },
          {
            note:
              "In **Collections** on the left, click the **...** for the **Student expert** collection and choose **Edit**. Open the " +
              "**Authorization** tab. Postman will add the API key details to the header for every request using the name `match_key` and " +
              "the value specified by the referenced `email_key` variable.",
            pic:
              "https://assets.postman.com/postman-docs/student-expert-collection-auth.jpg"
          }
        ],
        next: [
          {
            step:
              "Add a variable to the collection also via the **Edit** menu—choosing the **Variables** tab. Use the name `email_key` and enter " +
              "your email address as the value. Postman will now append your email address to each request to identify you as the client. " +
              "With your API Key in place, click **Send**.",
            pic:
              "https://assets.postman.com/postman-docs/student-expert-email-var.jpg"
          }
        ]
      }
    });
  } else if (!validator.validate(apiSecret)) {
    res.status(401).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "You got an unauthorized error response!",
        intro: "🚫Unauthorized - your key needs to be an email address!",
        steps: [
          {
            note:
              "The API will only authorize your requests if your key is a valid email address."
          }
        ],
        next: [
          {
            step:
              "Open your collection **Edit** menu and navigate to **Variables**. You should have a variable named `email_key`—make sure it's " +
              "value is an email address and click **Send** again.",
            pic: ""
          }
        ]
      }
    });
  } else {
    if (req.body.match && req.body.when && req.body.against) {
      const postId = db
        .get("matches")
        .push({
          id: shortid.generate(),
          creator: apiSecret,
          matchType: req.body.match,
          opposition: req.body.against,
          date: req.body.when,
          points: -1
        })
        .write().id;
      res.status(201).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "You added a new match! 🏅",
          intro: "Your new match was added to the database.",
          steps: [
            {
              note:
                "Go back into the `Get matches` request, make sure your `status` query parameter is set to `pending` and **Send** it again " +
                "before returning here—you should see your new addition in the array! _Note that this will only work if you're using the " +
                "Student Expert Postman template._"
            }
          ],
          next: [
            {
              step:
                "**Save** your current request, then create another new request still inside the **1. Begin training - Requests** folder. " +
                "Give it the name `3 Update score` and save it. Open it from the collection on the left. In the request builder select `PUT` " +
                "method, and enter the URL `{{training_api}}/match`. Click **Send**.",
              pic:
                "https://assets.postman.com/postman-docs/student-expert-put-url.jpg"
            }
          ]
        }
      });
    } else
      res.status(400).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "🚧 Bad request - please check your body data!",
          intro: "This endpoint requires body data representing the new match.",
          steps: [
            {
              note:
                "In **Body** select **raw** and choose `JSON` instead of `Text` in the drop-down list. Enter the following JSON data " +
                "including the enclosing curly braces:",
              raw_data: {
                match: "Cup Final",
                when: "{{$randomDateFuture}}",
                against: "Academical"
              },
              pic:
                "https://assets.postman.com/postman-docs/student-expert-body-added.jpg"
            },
            {
              note:
                "The `when` value uses a dynamic variable. Postman will add a random future date when you send your request. " +
                "There are lots of other dynamic variables you can use in your requests for values you want to calculate at runtime, or if " +
                "you want to use demo data instead of real values."
            }
          ],
          next: [
            {
              step: "With your body data in place, click **Send** again."
            }
          ]
        }
      });
  }
});

//update score
app.put("/match", function(req, res) {
  const apiSecret = req.get("match_key");
  var newDate = new Date();
  db.get("calls")
    .push({
      when: newDate.toDateString() + " " + newDate.toTimeString(),
      where: "PUT /match",
      what: req.query.match_id + " " + apiSecret
    })
    .write();
  if (!apiSecret)
    res.status(401).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Oops - You got an unauthorized error response! 🚫",
        intro:
          "You will need to authorize your request just as you did in the `POST` request.",
        steps: [
          {
            note:
              "You should already have your auth key set up, so you just need to select it here. Open the **Authorization** tab—select " +
              "`Inherit auth from parent` from the **Type** drop-down list."
          }
        ],
        next: [
          {
            step: "Click **Send**."
          }
        ]
      }
    });
  else if (!validator.validate(apiSecret))
    res.status(401).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "You got an unauthorized error response!",
        intro: "🚫Unauthorized - your key needs to be an email address!",
        steps: [
          {
            note:
              "The API will only authorize your requests if your key is a valid email address."
          }
        ],
        next: [
          {
            step:
              "Open your collection **Edit** menu and navigate to **Variables**. You should have a variable named `email_key`—make sure it's " +
              "value is an email address and click **Send** again."
          }
        ]
      }
    });
  else if (!req.query.match_id)
    res.status(400).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Your request is missing some info! 😕",
        intro: "This endpoint requires you to specify a match to update.",
        steps: [
          {
            note:
              "In **Params** add `match_id` in the **Key** column, and the `id` value from a match _you added_ to the customer list as the " +
              "**Value**. ***You can only update a match you added—in the `1. Get matches` response, find the `id` for the match you added " +
              "using the `POST` request.***",
            pic:
              "https://assets.postman.com/postman-docs/student-expert-put-id.jpg"
          }
        ],
        next: [
          {
            step:
              "With your parameter in place (you'll see e.g. `?match_id=101` added to the request address), click **Send** again."
          }
        ]
      }
    });
  else if (!req.body.points)
    res.status(400).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Your request is incomplete! ✋",
        intro:
          "This endpoint requires body data representing the updated score.",
        steps: [
          {
            note:
              "In **Body** select **raw** and choose **JSON** instead of `Text` in the drop-down list. Enter the following JSON data " +
              "including the enclosing curly braces:",
            raw_data: {
              points: 3
            },
            pic:
              "https://assets.postman.com/postman-docs/student-expert-score-body.jpg"
          }
        ],
        next: [
          {
            step: "With your body data in place, click **Send** again."
          }
        ]
      }
    });
  else {
    var updateMatch = db
      .get("matches")
      .find({ id: req.query.match_id })
      .value();
    console.log(updateMatch);
    if (
      updateMatch &&
      apiSecret != "postman" &&
      updateMatch.creator == apiSecret
    ) {
      db.get("matches")
        .find({ id: req.query.match_id })
        .assign({
          score: req.body.points
        })
        .write();

      res.status(201).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "You updated a match! ✅",
          intro: "Your match score was updated in the database.",
          steps: [
            {
              note:
                "Go back into the `1. Get matches` request and **Send** it again before returning here—" +
                "you should see your updated match in the array!"
            }
          ],
          next: [
            {
              step:
                "Next create a final request in the folder, this time naming it `4. Remove match`. Open it and set the method to `DELETE`, and " +
                "the URL to `{{training_api}}/match/:match_id`.",
              pic:
                "https://assets.postman.com/postman-docs/student-expert-delete-request.jpg"
            },
            {
              step:
                "This request includes a path parameter with `/:match_id` at the end of the request address—open **Params** and as the value " +
                "for the `match_id` parameter, enter the `id` of a match _you added_ when you sent the `POST` request. Copy the `id` from the " +
                "response in the `1. Get matches` request like you did for the `PUT` request then click **Send**."
            }
          ]
        }
      });
    } else {
      res.status(400).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "Your request is invalid! ⛔",
          intro:
            "You can only update matches you added using the `POST` method during the current session (and that haven't been deleted).",
          steps: [
            {
              note:
                "In **Params** add `match_id` in the **Key** column, and the `id` values from a match _you added_ to the customer list as the " +
                "**Value**. ***You can only update a match you added.***"
            }
          ],
          next: [
            {
              step:
                "With the ID parameter for a match _you added_ during this session in place, click **Send** again."
            }
          ]
        }
      });
    }
  }
});

//delete match
app.delete("/match/:match_id", function(req, res) {
  const apiSecret = req.get("match_key");
  var newDate = new Date();
  db.get("calls")
    .push({
      when: newDate.toDateString() + " " + newDate.toTimeString(),
      where: "DEL /match",
      what: req.params.match_id + " " + apiSecret
    })
    .write();
  if (!apiSecret)
    res.status(401).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "Oops - You got an unauthorized error response! 🚫",
        intro:
          "You will need to authorize your request just as you did in the `POST` and `PUT` requests.",
        steps: [
          {
            note:
              "You already have your auth key set up, so you just need to select it here. Open the **Authorization** tab—select " +
              "`Inherit auth from parent` from the **Type** drop-down list."
          }
        ],
        next: [
          {
            step: "Click **Send**."
          }
        ]
      }
    });
  else if (!validator.validate(apiSecret))
    res.status(401).json({
      welcome: welcomeMsg,
      tutorial: {
        title: "You got an unauthorized error response!",
        intro: "🚫Unauthorized - your key needs to be an email address!",
        steps: [
          {
            note:
              "The API will only authorize your requests if your key is a valid email address."
          }
        ],
        next: [
          {
            step:
              "Open your collection **Edit** menu and navigate to **Variables**. You should have a variable named `email_key`—make sure it's " +
              "value is an email address and click **Send** again."
          }
        ]
      }
    });
  else {
    //check the record matches the user id
    var match = db
      .get("matches")
      .find({ id: req.params.match_id })
      .value();
    if (match && apiSecret != "postman" && match.creator == apiSecret) {
      db.get("matches")
        .remove({ id: req.params.match_id })
        .write();
      res.status(200).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "You deleted a match! 🏆",
          intro: "Your match was removed from the database.",
          steps: [
            {
              note:
                "Go back into the first request you opened `Get matches` and **Send** it again before returning here—" +
                "you should see that your deleted match is no longer in the array!"
            }
          ],
          next: [
            {
              step:
                "🎊 You completed the first part of Postman Student Expert training! Next we're going to jump into the `2. Scripting and " +
                "Collection Runs` folder—open the folder, open the first request, and hit **Send**! 🚀"
            }
          ]
        }
      });
    } else {
      res.status(400).json({
        welcome: welcomeMsg,
        tutorial: {
          title: "Your request is invalid! ⛔",
          intro:
            "You can only remove matches you added using the `POST` method during the current session (and that haven't been deleted yet).",
          steps: [
            {
              note:
                "In **Params** add `match_id` in the **Key** column, and the `id` values from a match _you added_ to the match list as the " +
                "**Value**. ***You can only remove a match you added.***"
            }
          ],
          next: [
            {
              step:
                "With the ID parameter for a match _you added_ during this session in place, click **Send** again."
            }
          ]
        }
      });
    }
  }
});

// removes entries from users and populates it with default users
app.get("/reset", (req, res) => {
  const apiSecret = req.get("admin_key"); //TODO standard response
  if (!apiSecret || apiSecret !== process.env.SECRET) {
    res.status(401).json(unauthorizedMsg);
  } else {
    // removes all entries from the collection
    db.get("matches")
      .remove()
      .write();
    console.log("Database cleared");

    // default users inserted in the database
    var matches = [
      {
        id: shortid.generate(),
        creator: "postman",
        matchType: "League Cup Semi Final",
        opposition: "United",
        date:
          "Wed Mar 24 2021 14: 00: 04 GMT+0000 (Coordinated Universal Time)",
        points: -1
      },
      {
        id: shortid.generate(),
        creator: "postman",
        matchType: "League Cup Quarter Final",
        opposition: "City",
        date:
          "Thu Jan 30 2020 20: 50: 46 GMT+0000 (Coordinated Universal Time)",
        points: 3
      },
      {
        id: shortid.generate(),
        creator: "postman",
        matchType: "Friendly",
        opposition: "Athletic",
        date:
          "Wed Jan 13 2021 23: 01: 26 GMT+0000 (Coordinated Universal Time)",
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
    res.redirect("/");
  }
});

// removes all entries from the collection
app.get("/clear", (req, res) => {
  const apiSecret = req.get("admin_key");
  if (!apiSecret || apiSecret !== process.env.SECRET) {
    res.status(401).json(unauthorizedMsg);
  } else {
    // removes all entries from the collection
    db.get("matches")
      .remove()
      .write();
    console.log("Database cleared");
    res.status(200).json({
      title: "Database cleared",
      intro: "You cleared the DB."
    });
  }
});

//TODO add logging and admin calls to retrieve all matches / calls, to delete specific records

//TODO errors - these are unreachable now, make them standard schema
//generic get error
app.get("/*", (req, res) => {
  res.status(400).json({
    error:
      "🚧Oops this isn't a valid endpoint! " +
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});
app.post("/*", (req, res) => {
  res.status(400).json({
    error:
      "🚧Oops this isn't a valid endpoint! " +
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});
app.put("/*", (req, res) => {
  res.status(400).json({
    error:
      "🚧Oops this isn't a valid endpoint! " +
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});
app.patch("/*", (req, res) => {
  res.status(400).json({
    error:
      "🚧Oops this isn't a valid endpoint! " +
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});
app.delete("/*", (req, res) => {
  res.status(400).json({
    error:
      "🚧Oops this isn't a valid endpoint! " +
      "Try undoing your changes or closing the request without saving and opening it again from the collection on the left."
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
