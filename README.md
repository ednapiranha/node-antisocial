# Antisocial

Public key private messaging.

## Disclaimer

This is using node-sodium and don't get in my face about how secure/insecure it is. If there is a problem with that library, please help them fix and then send me a pull request for an updated version. Otherwise, use at your own risk for your random sexts.

## How to use

    var Antisocial = require('antisocial');
    var a = new Antisocial({
      dbPath: './db',
      chatPath: './db-chat'
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

    a.decrypt(message, receiverPublicKey, function (err, decrypted) {
      console.log(decrypted);
    });

## Display all chats

    a.getChats(function (err, chats) {
      console.log(chats);
    });
