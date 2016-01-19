// start up script that creates some users for testing
// users have the username 'user1@test.com' .. 'user8@test.com'
// and the password test123
Meteor.startup(function () {
  if (!Meteor.users.findOne()) {
    for (var i = 1; i < 9; i++){
      var email = "user" + i + "@test.com";
      var username = "user" + i;
      var avatar = "ava" + i + ".png"
      console.log("creating a user with password 'test123' and username/ email: " + email);
      Meteor.users.insert({
        profile: { username: username, avatar: avatar },
        emails: [{ address: email }],
        services: {
          password: {
            "bcrypt" : "$2a$10$I3erQ084OiyILTv8ybtQ4ON6wusgPbMZ6.P33zzSDei.BbDL.Q4EO"
          }
        }
      });
    }
  }
});

Chats.allow({
  insert: function(userId, chat) {
    // user must be logged in and chat must be owned by the user
    return userId && (userId === chat.user1Id || userId === chat.user2Id);
  }
});

Meteor.publish("minstantUsers", function() {
  return Meteor.users.find({});
})

Meteor.publish("chats", function() {
  return Chats.find({});
})