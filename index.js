'use strict';

var level = require('level');
var ursa = require('ursa');
var chat = require('level-threaded-chat');

var Antisocial = function (privateKeySender) {
  this.privateKey = privateKeySender;

  this.encrypt = function (message, publicKey) {
    publicKey = ursa.createPublicKey(this.privateKey.toPublicPem());

    return publicKey.encrypt(new Buffer(message, 'utf8'));
  };

  this.decrypt = function (message, publicKey) {
    var encoded = new Buffer(message, 'hex');

    return this.privateKey.decrypt(encoded).toString();
  };
};

module.exports = Antisocial;
