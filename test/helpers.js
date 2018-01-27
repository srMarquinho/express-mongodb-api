var supertest = require('supertest');
var chai = require('chai');
var chaiExclude = require('chai-exclude');
chai.use(chaiExclude);
var app = require('../app.js');
var db = require('monk')('localhost:27017/express_mongodb_api_test');

global.app = app;
global.db = db;
global.expect = chai.expect;
global.should = chai.should;
global.request = supertest(app);

// Messages
var message1 = {content: "This is an example message 1", timestamp: 1509104272, tags: ["important1", "private1", "draft1"] };
var message2 = {content: "This is an example message 2", timestamp: 1509104272, tags: ["important2", "private2", "draft2"] };
var message3 = {content: "This is an example message 3", timestamp: 1509104272, tags: ["important3", "private3", "draft3"] };
var message4 = {content: "This is an example message 4", timestamp: 1509104272, tags: ["important4", "private4", "draft4"] };

global.message1 = message1;
global.message2 = message2;
global.message3 = message3;
global.message4 = message4;
