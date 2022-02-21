const express = require('express');
const path = require("path");
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const { createSecureServer } = require("http2");
const nodemailer = require('nodemailer');
const db = require('./config/db');

require('dotenv').config();

const app = express();

// Parsing middleware
//pars application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));

//parse application /json
app.use(bodyParser.json());

//static files
app.use(express.static(path.join(__dirname, '/public')))
    .use(express.urlencoded({
        extended: true
    }));

//templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

const PORT = process.env.PORT || 8080;

db.connect((function(err) {
    if (err) throw err;
    console.log("Connected");
}));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
