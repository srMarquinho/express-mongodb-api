var express = require('express');
var router = express.Router();
var Message = require("../models/message");

/* GET all messages */
router.get('/messages', getMessages, function(req, res) {
  res.locals.messages.find({}, {}, function(err, doc) {
    if (err || doc === null) {
      sendJsonError(res);
    } else {
      sendJsonMessageSuccess(res, doc);
    }
  });
});

/* POST message */
router.post('/messages', getMessages, validateMessage, function(req, res) {
  // TODO id is ignored as it is auto-generated - check if it should fail and message the user
  // TODO check if sanitizing the content is enough or if should fail and message the user
  res.locals.messages.insert({
    content: req.sanitize(req.body.content),
    timestamp: req.body.timestamp,
    tags: req.body.tags || []
    
  }, function(err, doc) {
    if (err || doc === null) {
      sendJsonError(res);
    } else {
      res.statusCode = 201;
      sendJsonMessageSuccess(res, doc);
    }
  });
});

/* GET message */
router.get('/messages/:id', getMessages, validateId, function(req, res) {
  res.locals.messages.findOne({_id: req.params.id}, {}, function(err, doc) {
    if (err) {
      sendJsonError(res);
    } else if (doc === null) {
      res.statusCode = 404;
      sendJsonError(res);
    } else {
      sendJsonMessageSuccess(res, doc);
    }
  });
});

/* DELETE message */
router.delete('/messages/:id', getMessages, validateId, function(req, res) {
  res.locals.messages.findOneAndDelete({_id: req.params.id}, {}, function(err, doc) {
    if (err) {
      sendJsonError(res);
    } else if (doc === null) {
      res.statusCode = 404;
      sendJsonError(res);
    } else {
      sendJsonSuccess(res, "Message deleted");
    }
  });
});

// consider moving to a separated middlewares file
/* MIDDEWARES */
function getMessages(req, res, next) {
  res.locals.messages = req.db.get('messages');
  next();
}

function validateMessage (req, res, next) {
  if (Message.isValid(req.body)) {
    next();
  } else {
    sendJsonError(res, "Validation error: Message could not be created");
  }
}

function validateId(req, res, next) {
  if (Message.validId(req.params.id)) {
    next();
  } else {
    res.statusCode = 404;
    sendJsonError(res);
  }
}

// consider moving to a separated helpers file
/* HELPER FUNCTIONS */
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