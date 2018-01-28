function Message(){}

Message.validContent = function (content) {
  // Simple string (no HTML format / line breaks etc. required)
  return (content !== undefined && content !== "");
};

Message.validTimestamp = function (timestamp) {
  // Required and must be in unix timestamp format (10 integers)
  timestamp = timestamp || 0;
  var has_length_10 = timestamp.toString().length === 10;
  var is_date = (new Date(timestamp)).getTime();

  return (has_length_10 && is_date);
};

Message.validTags = function (tags) {
  // Array of strings - Can be empty - Must contain only strings as items if not empty
  if (tags !== undefined && tags.constructor === Array){
    return tags.every(function(i){ return typeof(i) === "string"; });
  } else {
    return false;
  }
};

Message.isValid = function (message) {
  return Message.validContent(message.content) && Message.validTimestamp(message.timestamp) && Message.validTags(message.tags);
};
 
module.exports = Message;