# LensLoop

This is a social media app built with the MERN stack.

## FEATURES IN LENSLOOP

# User Authentication
   - Description: Users can sign up and log in to the application.
   - Implementation: Utilizes authentication methods like email/password using json web token authentication providers.
   # Documentation:
     Users can sign up using their email and password.
     After signing up, users can log in using their credentials.
    Account verification can be implemented to ensure email validity.
# Post Management
 - Description: Users can create, view, edit, and delete posts.
 - Implementation: Employs CRUD operations to manage posts effectively.
 - Documentation:
 - Users can create new posts, providing images content.
 - Posts are displayed in a feed, where users can view them.
 - Users can edit their own posts to update content or correct mistakes.
 -Users can delete their own posts if they wish to remove them from the platform

# Like, Dislike, and Comment Features
 - Description: Users can like, dislike, and comment on posts.
 - Implementation: Provides UI elements for interacting with posts, including buttons for liking and     disliking,  and a comment section.
  - user can delete his own comment on the post where he gave a comment.
 - Documentation:
 - Users can express their appreciation for posts by clicking the "like" button.
 - Conversely, users can indicate their disapproval by clicking the "dislike" button.
 - Users can leave comments on posts to engage in discussions or provide feedback.

#  Story Viewing and Management
 - Description: Users can view and manage his his own stories and can the story of user whome he is following
 - Implementation: Includes a separate section for viewing stories, with options to add and delete his own post and comment on stories of user can like dislike and comment on this following post
 - Documentation:
 - Users can create short-lived stories consisting of images.
 - Stories are displayed prominently in a designated section of the app.
 - Users can view stories from accounts they follow and interact with them by liking, disliking, or commenting.
#  Follow/Unfollow and Follow Request Management
 - Description: Users can follow/unfollow other users and manage follow requests.
 - Implementation: Incorporates buttons for following/unfollowing users and a section for managing follow   requests.
 - Documentation:
 - Users can follow other users to receive updates on their posts and activities.
 - Users can unfollow other users if they no longer wish to see their content.
 - Follow requests are used when a user wants to follow a private account, and the account owner must approve  the request.
 - Users can withdraw follow requests or revoke their follow status with other users.
# Notification Section
 - Description: Users receive notifications for various actions such as likes, dislikes, and follow requests.
 - Implementation: Includes a notification system that sends notifications to users for relevant actions.
 Documentation:
 - Users receive notifications when someone likes,dislikes or send a follow request.
 - Notifications are also sent for follow requests and when they are accepted or rejected.
 - Users can view their notifications in a dedicated section of the app.
# Direct Messaging
 - Description: Users can send one-to-one messages to other users.
 - Implementation: Implements a messaging system that allows users to send and receive messages privately.
 Documentation:
 - Users can send private messages to other users, either from their profile or directly from the messaging  section.
 - Messages are displayed in a threaded conversation view, facilitating easy communication.
 

## TECHNOLOGIES USED

 - Frontend
   Html
   CSS 
   javascript 
   React.js
   other libary
     socket.io-client for message and notification mannagement
 - Backend
   Node.js(Run time enviroment)
   Express.js(framwork)
   MongoDB(Database)
   JWT Token(Authentication)
   Socket-Io(message)
   Rest Api
 - Cloudinary for image and video storing
  # Backend Implementation
 1 - Middleware: Describe any middleware used in your Express.js backend, such as logging, error handling, or authentication middleware.
2 - Routes: Provide an overview of the routes defined in your backend, including endpoints for user 1 - authentication, post management, following/unfollowing users, and direct messaging.
3 - Controllers: Explain the role of controllers in handling requests and responses, separating business logic from route definitions.
4 - Database Models: Briefly introduce the MongoDB models used to interact with the database, including schemas for users, posts, stories, notifications, and messages.
5 - Socket.IO Integration: Detail how Socket.IO is integrated into your backend to handle real-time messaging and notifications, including event listeners and emitters.
  # Frontend Implementation
Component Structure: Outline the structure of your React frontend, including components responsible for user 1 1 - authentication, post management, story viewing, notifications, and direct messaging.
2 - State Management: Mention the state management approach used in your frontend, whether it's local component state, Context API, Redux, or another library.
1=3 - Socket.IO Client Usage: Provide examples of how Socket.IO client is utilized in the frontend to establish WebSocket connections, send and receive messages, and update UI in real-time.

## Setup

1. Clone the server repository : `git clone https://github.com/pruthiraj-97/lensloop-server.git`
2. Install dependencies: `npm install`
3. Start the server: `node index.js`

## Setup server through the Docker

1. pull the docker image : `docker pull pruthiraj/lensloopserver`
2. run the image : `docker run -d -p 4000:4000 pruthiraj/lensloopserver`

