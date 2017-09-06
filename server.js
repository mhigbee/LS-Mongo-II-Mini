const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Person = require('./models.js');

const port = process.env.PORT || 3000;

const app = express();

// error status code constants
const STATUS_SERVER_ERROR = 500;
const STATUS_USER_ERROR = 422;

app.use(bodyParser.json());

// Your API will be built out here.

app.get('/users', (req, res) => {
  Person.find({}, (err, people) => {
    if (err) {
      res.status(STATUS_SERVER_ERROR);
      res.json( { 'Error fetching users:': err })
    } else {
      res.json(people);
    }
  });
});

app.get('/users/:direction', (req, res) => {
  const { direction } = req.params;
  Person.find({})
    .sort( { firstName: direction } )
    .exec((err, people) => {
    if (err) {
      res.status(STATUS_SERVER_ERROR);
      res.json( { 'Error fetching users:': err })
    } else {
      res.json(people);
    }
  });
});

app.put('/update-user/:id', (req, res) => {
  const { id } = req.params;
  const { firstName, lastName } = req.body;
  Person.findByIdAndUpdate(
    id, { firstName, lastName }, { new: true }
  )
  .exec((err, updatedUser) => {
    if (err) {
      res.status(STATUS_SERVER_ERROR);
      res.json({ 'Error fetching users:': err })
    } else {
      res.json(updatedUser);
    }
  });
});


mongoose.Promise = global.Promise;
const connect = mongoose.connect(
  'mongodb://localhost/people',
  { useMongoClient: true }
);
/* eslint no-console: 0 */
connect.then(() => {
  app.listen(port);
  console.log(`Server Listening on ${port}`);
}, (err) => {
  console.log('\n************************');
  console.log("ERROR: Couldn't connect to MongoDB. Do you have it running?");
  console.log('************************\n');
});
