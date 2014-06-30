'use strict';

var level = require('level');
var crypto = require('crypto');
var sodium = require('sodium');
var JSONB = require('json-buffer')
var LevelThreadedChat = require('level-threaded-chat');

var Antisocial = function (options) {
  var privateKeySender;
  this.publicKey;
  var chat = {};

  if (!options) {
    options = {};
  }

  this.dbPath = options.dbPath || './db'

  var db = level(this.dbPath, {
    createIfMissing: true,
    valueEncoding: 'json'
  });

  var self = this;

  var setKeys = function (next) {
    db.get('sender!keys', function (err, data) {
      if (err || !data) {
        var pair = new sodium.Key.Box();
        self.publicKey = pair.pk().toString();
        privateKeySender = pair.sk().toString();

        db.put('sender!keys', {
          pk: self.publicKey,
          sk: privateKeySender
        });
      } else {
        self.publicKey = data.pk();
        privateKeySender = data.sk();
      }

      self.publicKeyHash = crypto.createHash('md5').update(self.publicKey.toString()).digest('hex');

      chat = new LevelThreadedChat(self.publicKeyHash);
      next(true);
    });
  };

  this.encrypt = function (message, publicKey, next) {
    setKeys(function () {
      var receiverId = crypto.createHash('md5').update(publicKey.toString()).digest('hex');

      chat.follow(receiverId, function (err, user) {
        if (err) {
          next(err);
          return;
        }

        var box = new sodium.Box(publicKey, privateKeySender);
        message = box.encrypt(message, 'utf8');

        chat.addChat(receiverId, JSONB.stringify(message), {
          media: '',
          recipients: [receiverId],
          reply: ''
        }, function (err, c) {
          if (err) {
            next(err);
            return;
          }

          next(null, message);
        });
      });
    });
  };

  this.decrypt = function (message, publicKey) {
    var box = new sodium.Box(publicKey, privateKeySender);

    return box.decrypt(JSONB.parse(message), 'utf8');
  };

  this.getChats = function (publicKey, next) {
    var receiverId = crypto.createHash('md5').update(publicKey.toString()).digest('hex');

    chat.getChats(false, false, function (err, c) {
      if (err) {
        next(err);
        return;
      }

      next(null, c.chats);
    });
  };
};

module.exports = Antisocial;
