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
	
    var buffRespH = new Buffer(12);
    buffRespH[0] = PROTOCOL_VERSION;
    buffRespH[1] = tokenH;
    buffRespH[2] = tokenL;
    buffRespH[3] = PKT_PULL_RESP;
    var buffRespP = new Buffer(getDefaultTxPacket().toString());
    var buffResp = new Buffer.concat([buffRespH, buffRespP]);
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

function TxPacket(codr, data, datr, freq, ipol, modu, ncrc, powe, rfch, size, tmst) {
	this.codr = codr;
	this.data = data;
	this.datr = datr;
	this.freq = freq;
	this.ipol = ipol;
	this.modu = modu;
	this.ncrc = ncrc;
	this.powe = powe;
	this.rfch = rfch;
	this.size = size;
	this.tmst = tmst;
}

function getDefaultTxPacket() {
	return TxPacket("4/5", "", "SF12BW125", 869.525, true, "LORA", false, 14, 0, 12, Date.now() + 50);
}

serverUp.bind(1780, "192.168.19.101");
serverDown.bind(1782, "192.168.19.101");
