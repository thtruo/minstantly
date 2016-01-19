Meteor.subscribe("minstantUsers");

// set up the main template the the router will use to build pages
Router.configure({
  layoutTemplate: 'ApplicationLayout',
  loadingTemplate: 'loading'
});

// specify the top level route, the page users see when they arrive at the site
Router.route('/', function () {
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
    var filter = {
      $or: [
        { user1Id: Meteor.userId(), user2Id: otherUserId},
        { user2Id: Meteor.userId(), user1Id: otherUserId}
      ]
    };
    var chat = Chats.findOne(filter);
    var chatId;

    if (!chat) {
      chatId = Chats.insert({user1Id:Meteor.userId(), user2Id:otherUserId});
    } else {
      chatId = chat._id;
    }

    if (chatId) {
      Session.set("chatId", chatId);
    }

    this.render("navbar", {to:"header"});
    this.render("chat_page", {to:"main"});
  } else {
    this.render("navbar", {to:"header"});
    this.render("loading", {to:"main"});
  }
});

/**
 * helper functions
 */
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
    Session.set('loadingSplash', true); // show loading splash once
  }
};

Template.loading.destroyed = function () {
  if (this.loading) {
    this.loading.finish();
  }
};
