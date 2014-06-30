# Antisocial

Public key private messaging.

## How to use

    var Antisocial = require('antisocial');
    var a = new Antisocial({
      dbPath: './db'
    });

This will set up a private and public key pair for you if it hasn't already been created.

You can access your public key with:

    a.publicKey

## Encrypt a message

Assuming you have the receiver's public key:

    a.encrypt('This is a test for the sender', receiverPublicKey, replyId, function (err, c) {
      console.log(c);
    });

where `replyId` is the key of the message you are replying to. Set to false if it is a new message.

## Decrypt a message

Assuming you have an encrypted message:

    var decrypted = a.decrypt(message, receiverPublicKey);
    console.log(decrypted);

## Display all chats

    a.getChats(receiverPublicKey, function (err, chats) {
      console.log(chats);
    });
