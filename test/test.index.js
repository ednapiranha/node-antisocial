'use strict';

process.env.NODE_ENV = 'test';

var ursa = require('ursa');
var should = require('should');
var Antisocial = require('../index');
var a = new Antisocial(ursa.generatePrivateKey());

var privateKeyReceiver = ursa.generatePrivateKey().toPublicPem();
var publicKeyReceiver = ursa.createPublicKey(privateKeyReceiver, 'utf8').toPublicPem();

var privateKeySender = ursa.generatePrivateKey().toPublicPem();
var publicKeySender = ursa.createPublicKey(privateKeySender, 'utf8').toPublicPem();

describe('validate', function () {
  it('should encrypt and decrypt a message to self', function () {
    var encrypted = a.encrypt('This is a test for the sender', publicKeyReceiver);
    console.log('encrypted message. ', encrypted.toString());
    var decrypted = a.decrypt(encrypted, publicKeyReceiver);
    console.log('decrypted message. ', decrypted);
    decrypted.should.equal('This is a test for the sender');
  });

  it('should encrypt and decrypt a message to other', function () {
    var encrypted = a.encrypt('This is a test for the receiver', publicKeySender);
    console.log('encrypted message. ', encrypted.toString());
    var decrypted = a.decrypt(encrypted, publicKeySender);
    console.log('decrypted message. ', decrypted);
    decrypted.should.equal('This is a test for the receiver');
  });

});
