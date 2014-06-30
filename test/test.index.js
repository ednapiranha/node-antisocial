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

describe('validate', function () {
  after(function () {
    child.exec('rm -rf ./test/db');
  });

  it('should encrypt and decrypt a message', function (done) {
    a.encrypt('This is a test for the sender', receiver.pk(), function (err, c) {
      should.exist(c);

      a.getChats(receiver.pk(), function (err, ch) {
        should.exist(ch[0]);

        var decrypted = a.decrypt(ch[0].value.message, receiver.pk());
        decrypted.should.equal('This is a test for the sender');
        console.log(ch[0].value)
        done();
      });
    });
  });
});
