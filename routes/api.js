var express = require('express');
var router = express.Router();

/* GET messages */
router.get('/messages', getCollection, function(req, res) {
  res.locals.collection.find({}, {}, function(err, doc) {
    if (err) {
      sendJsonError(res, "Error: There was a problem with your request");
    } else {
      sendJsonSuccess(res, doc);
    }
  });
});

/* POST messages */
router.post('/messages', getCollection, validateMessage, function(req, res) {
  res.locals.collection.insert({
    "content": req.body.content,
    "timestamp": req.body.timestamp,
    "tags": req.body.tags
  }, function(err, doc) {
    if (err) {
      sendJsonError(res, "Error: There was a problem with your request");
    } else {
      sendJsonSuccess(res, doc);
    }
  });
});

// middewares
function getCollection(req, res, next) {
  res.locals.collection = req.db.get('messages');
  next();
}

function validateMessage (req, res, next) {
  // TODO validate message
  next();
}

// helper functions
function sendJsonSuccess(res, data) {
  res.json({
    "result": true,
    "dataType": "message",
    "data": data
  });
}

function sendJsonError(res, data) {
  res.json({
    "result": false,
    "dataType": "string",
    "data": data
  });
}

module.exports = router;