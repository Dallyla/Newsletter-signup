//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
// const request = require("request");

const app = express();   // express app

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended :true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
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
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/dde0451d62";

    const options = {
        method: "POST",
        auth: "dallyla1:7f46071ae6f771b408eae5d4a383049c-us17"
    }

    const request = https.request(url, options, function(response) {
        
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();


});

app.post("/failure", function (req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
    console.log("The server is up and running on port 3000");
})