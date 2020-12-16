const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  //if type = get
  if (req.method = 'GET') {
    //if req.url = '/swim'
    // if (req.url = '/swim') {
      let commands = ['up', 'down', 'left', 'right'];
      let randomIndex = Math.floor(Math.random() * commands.length);
      let randomDirection = commands[randomIndex];
      //array with 4 commands
      //randomIndex = random number between 1 and 3
      //respond with random swim command
      res.writeHead(200, headers);
      res.write(randomDirection);
      res.end();
    // }
  }
  next(); // invoke next() at the end of a request to help with testing!
};
