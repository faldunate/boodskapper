var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var redis = require("redis");
server.listen(3005);

app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

io.sockets.on('connection', function (socket) {
  var subscribe = redis.createClient();

  subscribe.subscribe('notifications.create');
  subscribe.on("message", function(channel, response) {
    response = JSON.parse(response);
    console.log("from rails to subscriber:", channel, response );
    console.log( response.data );
    socket.emit(response.channel, response.data )
  });
});
