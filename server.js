var express = require('express');
var app = express();
//var sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


