Chats = new Mongo.Collection("chats");

if (Meteor.isClient) {

  Meteor.subscribe("minstantUsers");

  // set up the main template the the router will use to build pages
  Router.configure({
    layoutTemplate: 'ApplicationLayout',
    loadingTemplate: 'loading'
  });

  // specify the top level route, the page users see when they arrive at the site
  Router.route('/', function () {
    console.log("rendering root /");
    this.render("navbar", {to:"header"});
    this.render("lobby_page", {to:"main"});
  });

  // specify a route that allows the current user to chat to another users
  Router.route('/chat/:_id', function () {

    // Ensure users cannot see chats that they are not part of
    if (!Meteor.userId()) {
      this.redirect("/");
    }

    this.wait(Meteor.subscribe("chats"));

    if (this.ready()) {
      var otherUserId = this.params._id;

      var filter = {$or:[
                  {user1Id:Meteor.userId(), user2Id:otherUserId},
                  {user2Id:Meteor.userId(), user1Id:otherUserId}
                  ]};
      var chat = Chats.findOne(filter);
      var chatId;

      if (!chat) {
        console.log("Couldn't find chat with", Meteor.userId(), "and", otherUserId, "...");
        chatId = Chats.insert({
          user1Id:Meteor.userId(), user2Id:otherUserId
        }, function (err, id) {
          if (err) {
            console.log("Error on inserting new chat");
          } else{
            console.log("Success on inserting new chat");
          }
        });
      } else {
        console.log("Found chat with", Meteor.userId(), "and", otherUserId, "!");
        chatId = chat._id;
      }
      console.log("Got a chat and chatId...");
      if (chatId) {
        Session.set("chatId", chatId);
        console.log("Setting chatId session");
        console.log("    chatId session", Session.get("chatId"));
      }
      console.log("Ready to render...");
      this.render("navbar", {to:"header"});
      this.render("chat_page", {to:"main"});
    } else {
      console.log("Loading...");
      this.render("navbar", {to:"header"});
      this.render("loading", {to:"main"});
    }

  });

  ///
  // helper functions
  ///
  Template.available_user_list.helpers({
    users:function(){
      return Meteor.users.find();
    }
  })
  Template.available_user.helpers({
    getUsername:function(userId){
      user = Meteor.users.findOne({_id:userId});
      return user.profile.username;
    },
    isMyUser:function(userId){
      if (userId == Meteor.userId()){
        return true;
      }
      else {
        return false;
      }
    }
  })

  Template.chat_page.helpers({
    messages: function() {
      var chat = Chats.findOne({_id:Session.get("chatId")});
      return chat.messages;
    }
  })

  Template.chat_message.helpers({
    getUsername: function(userId) {
      user = Meteor.users.findOne({_id:userId});
      return user.profile.username;
    },
    getAvatar: function(userId) {
      user = Meteor.users.findOne({_id:userId});
      return user.profile.avatar;
    },
    isOtherUser: function(userId) {
      var chat = Chats.findOne({_id:Session.get("chatId")});
      var otherUser;
      if (Meteor.userId() == userId) {
        if (userId == chat.user1Id) {
          otherUser = chat.user2Id;
        } else {
          otherUser = chat.user1Id;
        }
        return false;
      }
      otherUser = userId;
      return true;
    }
  })

  Template.chat_page.events({
    'submit .js-send-chat': function(event) {
      // stop form from triggering a page reload
      event.preventDefault();

      var chatSessionId = Session.get("chatId");
      var msg = event.target.chat.value;

      Meteor.call("addMessage", chatSessionId, msg, function (err) {
        if (err) {
          console.log("[Client] Error in calling method `addMessage`");
        }
      });

      // reset the form
      event.target.chat.value = "";
    }
   })

  Template.loading.rendered = function () {
    var message = '<p class="loading-message">Loading Message</p>';
    var spinner = '<div class="sk-spinner sk-spinner-rotating-plane"></div>';
    if (!Session.get('loadingSplash')) {
      this.loading = window.pleaseWait({
        logo: '/meteor-logo.png',
        backgroundColor: '#fff',
        loadingHtml: message + spinner
      });
      Session.set('loadingSplash', false); // show loading splash once
    }
  };

  Template.loading.destroyed = function () {
    if (this.loading) {
      this.loading.finish();
    }
  };

}


// start up script that creates some users for testing
// users have the username 'user1@test.com' .. 'user8@test.com'
// and the password test123

if (Meteor.isServer) {

  Chats.allow({
    insert: function(userId, chat) {
      // user must be logged in and chat must be owned by the user
      return userId && (userId === chat.user1Id || userId === chat.user2Id);
    }
  });

  Meteor.startup(function () {
    if (!Meteor.users.findOne()){
      for (var i=1;i<9;i++){
        var email = "user"+i+"@test.com";
        var username = "user"+i;
        var avatar = "ava"+i+".png"
        console.log("creating a user with password 'test123' and username/ email: "+email);
        Meteor.users.insert({profile:{username:username, avatar:avatar}, emails:[{address:email}],services:{ password:{"bcrypt" : "$2a$10$I3erQ084OiyILTv8ybtQ4ON6wusgPbMZ6.P33zzSDei.BbDL.Q4EO"}}});
      }
    }
  });

  Meteor.publish("minstantUsers", function() {
    console.log("In minstantUsers publish");
    return Meteor.users.find({});
  })

  Meteor.publish("chats", function() {
    console.log("In chats publish");
    return Chats.find({});
  })

}
