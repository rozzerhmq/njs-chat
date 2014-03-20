var socket = require('socket.io');
var connecitons = 0;
var users = {};
var count = 1;
var guestName = 'Guest';

exports.listen = function(server){
   var io = socket.listen(server);
   io.sockets.on('connection', function(socket){
      users[socket.id] = randomName();
      socket.on('msg', function(from, msg){
         socket.boardcast.emit('msg', {from: from, msg: msg});
      });

      connections++;
   });

   io.sockets.on('disconnect', function(socket){
      users[socket.id] = null;
      delete users[socket.id];
      connections--;
   });
}

exports.totalConnections = function(){
   return connections;
}

function randomName(){
   return guestName + count++;
}
