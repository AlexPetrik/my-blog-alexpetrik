const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const db = require("./config/db");

const app = express();

// Configuration

var port = process.env.PORT || 8080;
app.engine('ejs', require("ejs-locals"));
app.set('views', './views');
app.set('view engine', 'ejs');


// Middleware

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({  extended: true }));

MongoClient.connect(db.url, (err, database) => {
  if (err) {
    return console.log(err);
  }
  require('./app/routes')(app, database);
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });
});



