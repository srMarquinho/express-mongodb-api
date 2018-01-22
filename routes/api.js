var express = require('express');
var router = express.Router();

/* GET api listing. */
router.get('/messages', function(req, res, next) {
  res.send('return from api.js');
});

module.exports = router;
