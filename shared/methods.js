/**
 * Code like Meteor methods are shared between client and server
 */

Meteor.methods({
  // add new message
  addMessage: function(chatSessionId, msg) {
    var chat = Chats.findOne({ _id: chatSessionId });

    if (chat) {
      var msgs = chat.messages;
      if (!msgs) {
        msgs = [];
      }

      // add most recent message to msgs[]
      msgs.push({ text: msg, user: Meteor.userId() });

      // put the messages array onto the chat object
      chat.messages = msgs;

      // update the chat object in the database.
      Chats.update({ _id: chat._id }, chat, function(err) {
        if (err) {
          console.log("error in updating chat.messages");
        }
      });
    }
  }
});