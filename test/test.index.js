'use strict';

process.env.NODE_ENV = 'test';

var sodium = require('sodium');
var child = require('child_process');
var should = require('should');
var Antisocial = require('../index');
var a = new Antisocial({
  dbPath: './test/db'
});

var receiver = new sodium.Key.Box();

var originalMsg = 'This is a test for the sender';
var msg = '';

describe('validate', function () {
  after(function () {
    child.exec('rm -rf ./test/db');
  });

  it('should encrypt a message', function (done) {
    a.encrypt(originalMsg, receiver.pk(), false, function (err, c) {
      should.exist(c);
      done();
    });
  });

  it('should get all chats', function (done) {
    a.getChats(function (err, ch) {
      should.exist(ch[0]);
      msg = ch[0].value.message;
      done();
    });
  });

  it('should decrypt a message', function (done) {
    a.decrypt(msg, receiver.pk(), function (err, decrypted) {
      decrypted.should.equal(originalMsg);
      done();
    });
  });
});
