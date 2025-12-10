require('dotenv').config();
const fs = require("fs");
const express = require("express");
const { google } = require("googleapis");
const open = require("open");

const app = express()

const oauth2Client = new google.auth.OAuth2(
    `${process.env.CLIENT_ID}`,
    `${process.env.CLIENT_SECRET}`,

    "http://localhost:3000/oauth2callback"
);

// Scope untuk baca tugas

const SCOPES = [
    "https://www.googleapis.com/auth/classroom.courses.readonly",
    "https://www.googleapis.com/auth/classroom.coursework.me.readonly"
];

app.get("/", (req, res) => {
    const url = 
    oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        prompt: "consent"
    });

    open(url);
    res.send("Opening Google login...");
});


app.get("/oauth2callback", async (req, res) => {
    const code = req.query.code;

    const { tokens } = await
    oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    fs.writeFileSync("token.json", JSON.stringify(tokens));
    res.send("Token saved to token.json");
});

app.listen(3000, () => {
    console.log("server running at http://localhost:3000");
    console.log("open that link to start google login")
})