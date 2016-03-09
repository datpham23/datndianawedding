var express = require('express');
var router = express.Router();
var co = require('co');
var config = require('../../config');
var winston = require('winston');
var r = require('rethinkdbdash')();
var app = require('../../devServer');


const db = 'dnd';
const table = 'guests';


router.post('/link/:id', (req, res) => {
  co(function*() {
    winston.log(`RSVP ${req.params.id} : ${req.body}`);
    var guest = yield r.db(db)
      .table(table)
      .get(req.params.id);
    if (!guest)
      res.status(404).send('Cannot find guest');

    guest.guests = req.body;
    guest.hasRSVP = true;

    var result = yield r.db(db)
      .table(table)
      .update(guest);

    res.send('RSVP Completed');
  })

});


router.post('/manual', (req, res) => {
  co(function*() {
    winston.log(`RSVP : ${req.body}`);

    var dbRes = yield r.db(db)
      .table(table)
      .insert(req.body);

    res.send('RSVP Completed');s
  })

});


module.exports = router;
