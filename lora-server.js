var mqtt = require('mqtt');
var dgram  = require('dgram');
var server = dgram.createSocket('udp4');

const UDP_MSG_PRMBL_OFF = 12;
const DEFAULT_PORT_UP   = 1780;
const DEFAULT_PORT_DW   = 1782;

const PROTOCOL_VERSION  = 1;
const PKT_PUSH_DATA     = 0;
const PKT_PUSH_ACK      = 1;
const PKT_PULL_DATA     = 2;
const PKT_PULL_RESP     = 3;
const PKT_PULL_ACK      = 4;

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (buffUp, rinfo) => {
 // console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);   
    console.log("UP: Server got(RAW): " + buffUp);
    for (var i = 0; i < UDP_MSG_PRMBL_OFF; i ++) {
        console.log("buffUp[" + i + "] = " + buffUp[i]);
    }

    /** Random tokens **/
    var tokenH = buffUp[1];
    var tokenL = buffUp[2];
    
    /** Protocol version **/
    var protoV = buffUp[0];

    /** Packet direction **/
    var pakctD = buffUp[3];    
    
    //To do: verify necessary flags

    var msgStr = buffUp.toString();
    var jsonOffset = UDP_MSG_PRMBL_OFF;
    console.log("jsonOffset: " + jsonOffset);
    var jsonStr = msgStr.substring(jsonOffset);
    var json = JSON.parse(jsonStr);
    
    var buffAck = new Buffer(4);
    buffAck[0] = PROTOCOL_VERSION;
    buffAck[1] = tokenH;
    buffAck[2] = tokenL;
    buffAck[3] = PKT_PUSH_ACK;

    console.log('JSON:' + json);
    setTimeout(() => server.send(buffAck, 0, buffAck.length, 1780, "192.168.19.161"), 100);
});


server.on('listening', () => {
  var address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(1780, "192.168.19.101");
