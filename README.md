# bepis-chat
![bepis-logo](http://ih0.redbubble.net/image.207066066.3353/fc,550x550,white.jpg)

## Simple chatting app using Socket.IO and Node.JS

* This isn't supposed to be a groundbreaking app, this has been done a million times before and definitely have a better implementation than I'll be able to manage.
* It's merely a way for me to learn Node.JS and how to use Web Sockets with Socket.IO
* It may take a while to get an initial version up and running.

## Config

* Install Node.js on your machine (https://nodejs.org/en/download/), currently using v6.3.1-v6.4.1 for development.
  Should work with most versions, including LTS.
* Define an environment variable *MONGODB_URI* which should contain a URI pointing to your local MongoDB server.
* OR provide the URI as a command-line argument.

## Running the app

1. Run *npm installDependencies* to install both Node and Bower dependencies
2. Start the server with *node app.js*
* OR you can combine the 2 steps above by running *npm start*
