const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const messageQueue = require('./messageQueue')

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('..', 'background.jpg');
////////////////////////////////////////////////////////

module.exports.router = (req, res, next = () => {}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  if (req.method === 'GET') {
    if (req.url === '/') {
      res.writeHead(200, headers);
      res.end(messageQueue.dequeue());
    } else if (req.url === '/background.jpg') {
      console.log('started response')
      fs.readFile(module.exports.backgroundImageFile, (err, data) => {
        if (err) {
          console.log('Did Error and stuff')
          console.log(err);
          res.writeHead(404, headers);
          res.end();
          next();
        } else {
          res.writeHead(200, headers);
          res.write(data, 'binary');
          res.end();
          next();
        }
      })
      // res.writeHead(200, headers);
      // res.end();
    } else {

      res.writeHead(404, headers);
      res.end();
    }
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  }
  next(); // invoke next() at the end of a request to help with testing!
};

const chooseDirection = () => {
  let commands = ['up', 'down', 'left', 'right'];
  let randomIndex = Math.floor(Math.random() * commands.length);
  return commands[randomIndex];
}

// let messageQueue = null;
// module.exports.initialize = (queue) => {
//   messageQueue = queue;
// };