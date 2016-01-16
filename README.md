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

Remove the autopublish package from the application and implement publish and subscribe for Chats. Users should only be able to retrieve chats that have their user id in either the user1Id field or the user2Id field. Test by logging in as different users and checking what you can see

### Challenge: Implement emoticons

Can you implement emoticon functionality which allows the user to insert graphical emoticons into their message? Emoticons are small icons such as smiley faces which are typical of this kind of application.


