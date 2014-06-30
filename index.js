'use strict';

var level = require('level');
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
    if (self.publicKey && privateKeySender) {
      next(true);
      return;
    }

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

      self.publicKeyHash = self.publicKey.toString();

      chat = new LevelThreadedChat(self.publicKeyHash);
      next(true);
    });
  };

  this.encrypt = function (message, publicKey, replyId, next) {
    setKeys(function () {
      var receiverId = publicKey.toString();

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
          reply: replyId || ''
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

  this.getChats = function (next) {
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
