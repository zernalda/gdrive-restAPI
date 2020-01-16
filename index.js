const express = require('express'),
      app = express(),
      port = process.env.PORT || 3001,
      bodyParser = require('body-parser'),
      controller = require('./src/app/controller');

const cors = require('cors');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());

var routes = require('./src/app/routes');
routes(app);

app.listen(port);
console.log('RESTful API server started on: ' + port);