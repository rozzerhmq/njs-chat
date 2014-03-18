'use strict';

var http = require('http');
var fs = require('fs');
var util = require('util');
var mime = require('mime');

var port = 3000;
var counter = 0;
var cache = {};

var error404 = function(res){
   res.writeHead(404, {"Content-Type": 'text/plain'});
   res.end("Not Found!");
}

var serveFile = function(path, res){
   fs.readFile(path, function(err, data){
      if(err) error404(res);

      var type = mime.lookup(path);
      cache[path] = {data: data, type: type};
      res.writeHead(200, {'Content-Type': type});
      res.end(data);
   });
}

var serveStatic = function(req, res){
   var fullPath = "";

   if(req.url === '/'){
      fullPath = __dirname + '/asset/html/index.html';
   } else {
      fullPath = __dirname + req.url;
   }

   if(cache[fullPath]){
      var data = cache[fullPath];
      res.writeHead(200, {'Content-Type': data.type});
      res.end(data.data);
   } else {
      serveFile(fullPath, res);
   }
}

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

   serveStatic(req, res);
}).listen(port);

console.log("Started http server, listening on port " + port);
