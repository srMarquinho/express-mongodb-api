describe('Messages API Routes', function() {
  
  before(function(done) {
    messages = db.get('messages');
    messages.insert([message1, message2, message3, message4]);
    done();
  });
  
  after(function(done) {
    messages.drop(function(err) {
      if (err) return done(err);
    });
    done();
  });
  
  describe('GET /api/messages', function() {
    it('get all messages and return corret json', function(done) {
      request.get('/api/messages')
        .expect(200)
        .end(function(err, res) {
          expect(res.body.result).to.equal(true);
          expect(res.body.dataType).to.equal('message');
          expect(res.body.data).to.have.lengthOf(4);
          done(err);
        });
    });
  });
  
  describe('POST /api/messages', function() {
    it('saves a message and return corret json', function(done) {
      var messagePost = { content: "This is an example POST message", timestamp: 1509104272, tags: ["importantPost", "privatePost", "draftPost"] };
      request.post('/api/messages')
        .send(messagePost)
        .expect(201)
        .end(function(err, res) {
          expect(res.body.result).to.equal(true);
          expect(res.body.dataType).to.equal('message');
          expect(res.body.data).excluding('_id').to.deep.equal(messagePost);
          done(err);
        });
    });
    
    it('content is required', function(done) {
      var messageContent = { timestamp: 1509104272, tags: ["importantPost", "privatePost", "draftPost"] };
      request.post('/api/messages')
        .send(messageContent)
        .expect(200)
        .end(function(err, res) {
          expect(res.body.result).to.equal(false);
          expect(res.body.dataType).to.equal('string');
          expect(res.body.data).to.equal('Validation error: Message could not be created');
          done(err);
        });
    });
    
    it('content is not empty', function(done) {
      var messageContent = { content: "", timestamp: 1509104272, tags: ["importantPost", "privatePost", "draftPost"] };
      request.post('/api/messages')
      .send(messageContent)
      .expect(200)
      .end(function(err, res) {
        expect(res.body.result).to.equal(false);
        expect(res.body.dataType).to.equal('string');
        expect(res.body.data).to.equal('Validation error: Message could not be created');
        done(err);
      });
    });
    
    it('content must not have HTML tags', function(done) {
      var messageContent = { content: "This <div>inside</div>is an example <script>inside</script> message", timestamp: 1509104272, tags: ["importantPost", "privatePost", "draftPost"] };
      request.post('/api/messages')
        .send(messageContent)
        .expect(201)
        .end(function(err, res) {
          expect(res.body.data).excluding(['_id', 'timestamp', 'tags']).not.equal(messageContent);
          done(err);
        });
    });
    
    it('timestamp is required', function(done) {
      var messageTimestamp = { content: "This is an example POST message", tags: ["importantPost", "privatePost", "draftPost"] };
      request.post('/api/messages')
        .send(messageTimestamp)
        .expect(200)
        .end(function(err, res) {
          expect(res.body.result).to.equal(false);
          expect(res.body.dataType).to.equal('string');
          expect(res.body.data).to.equal('Validation error: Message could not be created');
          done(err);
        });
    });
    
    it('timestamp is a unix timestamp format (10 integers)', function(done) {
      var messageTimestamp = { content: "This is an example POST message",  timestamp: 123456789, tags: ["importantPost", "privatePost", "draftPost"] };
      request.post('/api/messages')
        .send(messageTimestamp)
        .expect(200)
        .end(function(err, res) {
          expect(res.body.result).to.equal(false);
          expect(res.body.dataType).to.equal('string');
          expect(res.body.data).to.equal('Validation error: Message could not be created');
          done(err);
        });
    });
    
    it('tags must be an array', function(done) {
      var messageTags = { content: "This is an example POST message",  timestamp: 1509104272, tags: "importantPost" };
      request.post('/api/messages')
        .send(messageTags)
        .expect(200)
        .end(function(err, res) {
          expect(res.body.result).to.equal(false);
          expect(res.body.dataType).to.equal('string');
          expect(res.body.data).to.equal('Validation error: Message could not be created');
          done(err);
        });
    });
    
    it('tags must contain only strings', function(done) {
      var messageTags = { content: "This is an example POST message",  timestamp: 1509104272, tags: ["string", true] };
      request.post('/api/messages')
        .send(messageTags)
        .expect(200)
        .end(function(err, res) {
          expect(res.body.result).to.equal(false);
          expect(res.body.dataType).to.equal('string');
          expect(res.body.data).to.equal('Validation error: Message could not be created');
          done(err);
        });
    });
    
    it('tags can be empty', function(done) {
      var messageTags = { content: "This is an example POST message",  timestamp: 1509104272, tags: [] };
      request.post('/api/messages')
        .send(messageTags)
        .expect(201)
        .end(function(err, res) {
          expect(res.body.result).to.equal(true);
          expect(res.body.dataType).to.equal('message');
          expect(res.body.data).excluding('_id').to.deep.equal(messageTags);
          done(err);
        });
    });
  });
  
  describe('GET /api/messages/:id', function() {
    it('get a message by id and return corret json', function(done) {
      messages.findOne({}, {}, function(err, message) {
        request.get('/api/messages/' + message._id)
          .expect(200)
          .end(function(err, res) {
            expect(res.body.result).to.equal(true);
            expect(res.body.dataType).to.equal('message');
            expect(res.body.data).excluding('_id').to.deep.equal(message);
            done(err);
          });
      });
    });
  
    it('returns status 404 when id is not found', function(done) {
      request.get('/api/messages/fakeId')
        .expect(404)
        .end(function(err, res) {
          done(err);
        });
    });
  });
  
  describe('DELETE /api/messages/:id', function() {
    it('removes a message and return corret json', function(done) {
      messages.findOne({}, {}, function(err, message) {
        request.delete('/api/messages/' + message._id)
          .expect(200)
          .end(function(err, res) {
            expect(res.body.result).to.equal(true);
            expect(res.body.dataType).to.equal('string');
            expect(res.body.data).to.equal('Message deleted');
            done(err);
          });
      });
    });
      
    it('returns status 404 when id is not found', function(done) {
      request.get('/api/messages/fakeId')
        .expect(404)
        .end(function(err, res) {
          done(err);
        });
    });
  });
});