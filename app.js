const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }
  var jsonData = JSON.stringify(data);

  const url = "https://us7.api.mailchimp.com/3.0/lists/fd01ad1683";
  const options = {
    method: "POST",
    auth: "shawn:73c4f8f20de8906a5b23f8a92e6ec41c-us7"
  }
  const request = https.request(url, options, (response) => {

   console.log("RESPONSE: " + response.statusCode);

   if (response.statusCode === 200) {
     res.sendFile(__dirname + "/success.html");
   } else {
     res.sendFile(__dirname + "/failure.html");
   }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", (req, res) => {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => {
  console.log("Server up and running on port 3000");
});


//73c4f8f20de8906a5b23f8a92e6ec41c-us7

// fd01ad1683
