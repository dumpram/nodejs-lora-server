var mqtt = require('mqtt');
var dgram  = require('dgram');
var server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  
  var jsonData = msg.substr(4);
  console.log('JSON:' + jsonData);
  //server.send(msg, 0, msg.length, 1782, "192.168.19.175");
});

server.on('listening', () => {
  var address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(1780, "192.168.19.161");
