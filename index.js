'use strict';

var level = require('level');
var sodium = require('sodium');
var chat = require('level-threaded-chat');

var Antisocial = function (options) {
  var privateKeySender;
  this.publicKey;

  if (!options) {
    options = {};
  }

  this.dbPath = options.dbPath || './db'

  var db = level(this.dbPath, {
    createIfMissing: true,
    valueEncoding: 'json'
  });

  var self = this;

  db.get('sender!keys', function (err, data) {
    if (err || !data) {
      var pair = new sodium.Key.Box();
      self.publicKey = pair.pk();
      privateKeySender = pair.sk();

      db.put('sender!keys', {
        pk: self.publicKey,
        sk: privateKeySender
      });
    } else {
      self.publicKey = data.pk();
      privateKeySender = data.sk();
    }

    next(true);
  });

  this.encrypt = function (message, publicKey) {
    var box = new sodium.Box(this.publicKey, privateKeySender);

    return box.encrypt(message, 'utf8');
  };

  this.decrypt = function (message, publicKey) {
    var box = new sodium.Box(this.publicKey, privateKeySender);

    return box.decrypt(message, 'utf8');
  };
};

module.exports = Antisocial;
