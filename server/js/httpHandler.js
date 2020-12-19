const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = require('./messageQueue');
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = () => {}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  switch (req.method) {
    case 'GET':
      if (req.url === '/') {
        res.writeHead(200, headers);
        res.end(messageQueue.dequeue());
        next();
      } else if (req.url === '/background.jpg') {
        fs.readFile(module.exports.backgroundImageFile, (err, data) => {
          if (err) {
            res.writeHead(404, headers);
          } else {
            res.writeHead(200, {
              'Content-Type': 'image/jpeg',
              'Content-Length': data.length
            });
            res.write(data, 'binary');
          }
          res.end();
          next();
        });
      } else {
        res.writeHead(404, headers);
        res.end();
        next();
      }
      break;

    case 'OPTIONS':
      res.writeHead(200, headers);
      res.end();
      next();
      break;

    case 'POST':
      if (req.url === '/background.jpg') {
        let image = Buffer.alloc(0);
        req.on('data', (chunk) => {
          image  = Buffer.concat([image, chunk]);
        });
        req.on('end', () => {
          let multiImage = multipart.getFile(image);
          fs.writeFile(module.exports.backgroundImageFile, multiImage.data, (err) => {
            res.writeHead(err? 400 : 201, headers);
            res.end();
            next();
          })
        })
      };
    break;
    default:
    break;
  }
};

const chooseDirection = () => {
  let commands = ['up', 'down', 'left', 'right'];
  let randomIndex = Math.floor(Math.random() * commands.length);
  return commands[randomIndex];
}



// if (req.method === 'GET') {
//   if (req.url === '/') {
//     res.writeHead(200, headers);
//     res.end(messageQueue.dequeue());
//   } else if (req.url === '/background') {
//     console.log('started response')
//     fs.readFile(module.exports.backgroundImageFile, (err, data) => {
//       if (err) {
//         console.log('Did Error and stuff');
//         console.log(err);
//         res.writeHead(404, headers);
//         res.end();
//         // next();
//       } else {
//         res.writeHead(200, headers);
//         res.write(data, 'binary');
//         res.end();
//         // next();
//       }
//     })
//     // res.writeHead(200, headers);
//     // res.end();
//   } else {

//     res.writeHead(404, headers);
//     res.end();
//   }
// } else if (req.method === 'OPTIONS') {
//   res.writeHead(200, headers);
//   res.end();
// }
// next(); // invoke next() at the end of a request to help with testing!