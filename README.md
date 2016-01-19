# Minstant 

This is a project inspired by Coursera's [Web Application Development with Javascript and MongoDB](https://www.coursera.org/learn/web-application-development/home/welcome) course. 

## What is Minstant?

**Minstant** is an instant messaging app built with [Meteor](https://www.meteor.com) and Coursera's starter code. 

## [TODO] Modify and clean up wording for the tasks that follow

### Task 1: Improve the look and feel

Adapt the templates and helper functions so that the messaging window displays users’ avatars next to their messages. Feel free to add other enhancements!

- Thank heavens for [`object-fit: cover`](https://medium.com/@chrisnager/center-and-crop-images-with-a-single-line-of-css-ad140d5b4a87#.ik0qr64az) in CSS to center and crop images!

### Task 2: Implement data writing security

Remove the insecure package from the application and implement a Meteor method to allow the insertion of chat items in the Chats collection. Test that you cannot insert items directly any more.

### Task 3: Implement data reading security

Remove the autopublish package from the application and implement publish and subscribe for Chats. Users should only be able to retrieve chats that have their user id in either the user1Id field or the user2Id field. Test by logging in as different users and checking what you can see.

#### Lessons Learned
- Remember to publish the `Meteor.users` collection or else the homepage does not list all the **Minstant** users.
- Sometimes when refreshing a chat page between two users, both will end up in a new chat session. To fix this, wait for the subscription to be ready at the route before checking for any preexisting chat sessions. 
- An extension to the point above, I ran into a problem where inserting a new chat into the `Chats` collection failed. This is because no `Chats.allow`  was not defined for `insert` on the server-side. Remember to add this in for currently logged-in users in **Minstant**.
- To ensure users only retrieve chats with their userId in either `user1Id` or `user2Id`, add an extra condition in the `/chat/:_id` route to bring non-users back to the root.

### Challenge: Implement emoticons

Can you implement emoticon functionality which allows the user to insert graphical emoticons into their message? Emoticons are small icons such as smiley faces which are typical of this kind of application.

#### Lessons Learned
Use the [mattimo:emoticons](https://atmospherejs.com/mattimo/emoticons) package.

Refactored the application into a hierarchical structure.

### General Learnings
When creating the chat page, I wanted to correspond the height of the chat window to the viewport height `vh`. While I was able to keep all the content within the height of the window, a problem I encountered was being able to scroll new `div`s automatically when a user enters a new message. My solution follows this stackoverflow [approach](http://stackoverflow.com/questions/31436289/how-do-i-scroll-to-the-bottom-of-a-div-as-data-is-added-in-meteor). Specifically, I computed the different in offsets between the first and last message and then make the chat window scroll to that position.

    Template.chat_page.rendered = function() {
      $('.js-send-chat').on('submit', function() {
        var $firstMessageOffset = $(".chat_message_row:first").offset();
        if ($firstMessageOffset) {
          var scrollOffset = $(".chat_message_row:last").offset().top -
                             $firstMessageOffset.top;
          $(".chat_page-chat_window").animate({ scrollTop: scrollOffset }, '1000');
        }
        else { // no message so no need to scroll
          return;
        }
      });
    }