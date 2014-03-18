'use strict';

var http = require('http');
var fs = require('fs');
var util = require('util');

var port = 3000;
var counter = 0;
http.createServer(function(req, res){
   var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

   var log = {
      url: req.url,
      ip: ip
   };

   fs.appendFile('./log/request.log', util.inspect(log) + '\n', function(err){
      if(err) throw err;
   });

   console.log(++counter);
   res.writeHead(200, {'Content-Type': 'text/plain'});
   res.end('Hello,world!');
}).listen(port);

console.log("Started http server, listening on port " + port);
