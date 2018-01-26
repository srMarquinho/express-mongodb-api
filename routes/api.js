var express = require('express');
var router = express.Router();

/* GET all messages */
router.get('/messages', getCollection, function(req, res) {
  res.locals.collection.find({}, {}, function(err, doc) {
    if (err || doc == null) {
      sendJsonError(res);
    } else {
      sendJsonMessageSuccess(res, doc);
    }
  });
});

/* POST message */
router.post('/messages', getCollection, validateMessage, function(req, res) {
  res.locals.collection.insert({
    "content": req.body.content,
    "timestamp": req.body.timestamp,
    "tags": req.body.tags
  }, function(err, doc) {
    if (err || doc == null) {
      sendJsonError(res);
    } else {
      sendJsonMessageSuccess(res, doc);
    }
  });
});

/* GET message */
router.get('/messages/:id', getCollection, function(req, res) {
  res.locals.collection.findOne({_id: req.params.id}, {}, function(err, doc) {
    if (err || doc == null) {
      sendJsonError(res);
    } else {
      sendJsonMessageSuccess(res, doc);
    }
  });
});

/* DELETE message */
router.delete('/messages/:id', getCollection, function(req, res) {
  res.locals.collection.findOneAndDelete({_id: req.params.id}, {}, function(err, doc) {
    if (err || doc == null) {
      sendJsonError(res);
    } else {
      sendJsonSuccess(res, "Message deleted");
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
function sendJsonMessageSuccess(res, data) {
  sendJsonSuccess(res, data, "message");
}

function sendJsonSuccess(res, data, dataType) {
  dataType = dataType || "string";
  res.json({
    "result": true,
    "dataType": dataType,
    "data": data
  });
}

function sendJsonError(res, data) {
  data = data || "Error: There was a problem with your request";
  res.json({
    "result": false,
    "dataType": "string",
    "data": data
  });
}

module.exports = router;