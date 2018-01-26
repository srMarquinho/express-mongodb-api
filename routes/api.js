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
  // TODO id is ignored as it is auto-generated - check if should message the user
  // TODO check if sanitizing the content is enough or if should send error
  res.locals.collection.insert({
    "content": req.sanitize(req.body.content),
    "timestamp": req.body.timestamp,
    "tags": req.body.tags || []
    
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

/* middewares */
function getCollection(req, res, next) {
  res.locals.collection = req.db.get('messages');
  next();
}

function validateMessage (req, res, next) {
  if (validContent(req.body.content) && validTimestamp(req.body.timestamp) && validTags(req.body.tags)) {
    next();
  } else {
    sendJsonError(res, "Validation error: Message could not be created");
  }
}

/* helper functions */
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

/* validation helpers */
function validContent(content) {
  // Simple string (no HTML format / line breaks etc. required)
  return (content !== undefined && content !== "");
}

function validTimestamp(timestamp) {
  // Required and must be in unix timestamp format (10 integers)
  var is_defined = timestamp !== undefined;
  var has_length_10 = timestamp.toString().length === 10;
  var is_date = (new Date(timestamp)).getTime();
  
  return (is_defined && has_length_10 && is_date);
}

function validTags(tags) {
  // Array of strings - Can be empty - Must contain only strings as items if not empty
  tags = tags || [];
  var is_array = tags.constructor === Array;
  var all_strings = tags.every(function(i){ return typeof(i) === "string"; });
  
  return (is_array && all_strings);
}

module.exports = router;