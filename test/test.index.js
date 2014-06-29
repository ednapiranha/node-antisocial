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
    var encrypted = a.encrypt('This is a test for the sender', receiver.pk());
    console.log('encrypted message. ', encrypted);

    var decrypted = a.decrypt(encrypted, a.publickKey);
    console.log('decrypted message. ', decrypted);
    decrypted.should.equal('This is a test for the sender');
    done();
  });
});
