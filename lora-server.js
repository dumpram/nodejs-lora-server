var mqtt = require('mqtt');
var dgram  = require('dgram');
var serverUp = dgram.createSocket('udp4');
var serverDown = dgram.createSocket('udp4');

const UDP_MSG_PRMBL_OFF = 12;
const DEFAULT_PORT_UP   = 1780;
const DEFAULT_PORT_DW   = 1782;

const PROTOCOL_VERSION  = 1;
const PKT_PUSH_DATA     = 0;
const PKT_PUSH_ACK      = 1;
const PKT_PULL_DATA     = 2;
const PKT_PULL_RESP     = 3;
const PKT_PULL_ACK      = 4;

serverUp.on('error', (err) => {
    console.log(`serverUp error:\n${err.stack}`);
    serverUp.close();
});

serverUp.on('message', (buffUp, rinfo) => {
 // console.log(`serverUp got: ${msg} from ${rinfo.address}:${rinfo.port}`);   
    console.log("UP: serverUp got(RAW): " + buffUp);
    for (var i = 0; i < UDP_MSG_PRMBL_OFF; i ++) {
        console.log("buffUp[" + i + "] = " + buffUp[i]);
    }

    /** Sender's info **/
    var addr = rinfo.address;
    var port = rinfo.port;

    console.log("ADDR:" + addr);
    console.log("PORT:" + port);

    /** Random tokens **/
    var tokenH = buffUp[1];
    var tokenL = buffUp[2];
    
    /** Protocol version **/
    var protoV = buffUp[0];

    /** Packet direction **/
    var pakctD = buffUp[3];    
    
    //To do: check protocol consistency

    var msgStr = buffUp.toString();
    var jsonOffset = UDP_MSG_PRMBL_OFF;
    console.log("jsonOffset: " + jsonOffset);
    var jsonStr = msgStr.substring(jsonOffset);
//    var json = JSON.parse(jsonStr);
    
    var buffAck = new Buffer(4);
    buffAck[0] = PROTOCOL_VERSION;
    buffAck[1] = tokenH;
    buffAck[2] = tokenL;
    buffAck[3] = PKT_PUSH_ACK;

//    console.log('JSON:' + json);
    serverUp.send(buffAck, 0, buffAck.length, port, addr);
    //For some reason no UP ack is working yet

});

serverDown.on('message', (buffDw, rinfo) => {
    console.log('[DOWN] Server got(RAW): ' + buffDw);
    
    /** Sender's info **/
    var addr = rinfo.address;
    var port = rinfo.port;
	
	/** Protocol version **/
    var protoV = buffDw[0];

    /** Random tokens for time sync **/    
    var tokenH = buffDw[1];
    var tokenL = buffDw[2];

    /** Packet direction **/
    var packtD = buffDw[3];
	
    //TO DO: Check protocol consistency 
    if (packtD != PKT_PULL_DATA) {
        return;
    }
	
    var buffResp = new Buffer(12);
    buffResp[0] = PROTOCOL_VERSION;
    buffResp[1] = tokenH;
    buffResp[2] = tokenL;
    buffResp[3] = PKT_PULL_RESP;

    serverDown.send(buffResp, 0, buffResp.length, port, addr);          
});


serverUp.on('listening', () => {
    var address = serverUp.address();
    console.log('[UP] Server listening: ' + address);
});

serverDown.on('listening', () => {
    var address = serverDown.address();
    console.log('[DOWN] Server listening: ' + address);
});


serverUp.bind(1780, "192.168.19.101");
serverDown.bind(1782, "192.168.19.101");
