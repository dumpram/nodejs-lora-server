/**
 * Implementation of LoRa-Mac specification.
 */


/**
 * 6 different message types in MAC layer.
 */
const MTYPE_JOIN_REQUEST   = 0;
const MTYPE_JOIN_ACCEPT    = 1;
const MTYPE_UNCONF_DATA_UP = 2;
const MTYPE_CONF_DATA_UP   = 3;
const MTYPE_UNCONF_DATA_DW = 4;
const MTYPE_CONF_DATA_DW   = 5;
const MTYPE_RFU            = 6;
const MTYPE_PROPRIETARY    = 7;

/**
 * Physical layer message format: msg = MHDR | MACPayload | MIC
 */
function PHYPayload(data) {
    return new Buffer.concat([MHDR(data), MACPayload(data), MIC(data)]);
}

/**
 * MAC layer message format: msg = MHDR | FHDR | FPort | FRMPayload.
 */
function MACPayload(data) {
    return new Buffer.concat([FHDR(), FPort(), FRMPayload()])
}
/**
* Size of MAC header is 1 byte. Need to convert MType, RFU, and Mayor to bits.
*/
function MHDR(data) {
    /** Byte to bit conversion is needed **/
    // hope bit buffer implementation will do the trick
    return new BitBuffer.concat([MType(), RFU(), Mayor()])
}

/**
 * The message integrity code (MIC) is calculated over all the fields in the message.
 */
function MIC(data) {

}

function FHDR() {
    return new Buffer.concat([DevAdrr(), FCtrl(), FCnt(), FOpts()]);
}

/**
 * If the frame payload field is not empty, the port field must be present. If present, an FPort
 * value of 0 indicates that the FRMPayload contains MAC commands only; see Chapter  4.4 for a list
 * of valid MAC commands. FPort values 1..223 (0x01..0xDF) are application-specific. FPort values
 * 224..255 (0xE0..0xFF) are reserved for future standardized application extensions.
 */
function FPort() {

}

/**
 * Size of FRMPayload is from 0..N bytes and it is region specific. See Section 7 of LoraWAN specification.
 */
function FRMPayload() {

/**
 * Message type. 6 types are defined.
 */
function MType() {

}

/**
 * Useless for LoraWAN.
 */
function RFU() {
    return 00;

}

/**
 * Major version of protocol. For LoraWAN R1 00 is used.
 */
function Major() {
    return 00;

}

/**
 * Device address -> 4 bytes.
 */
function DevAddr() {

}
/**
 * Direction flag indicates stream direction. If true message is uplink,
 * otherwise is downlink. Size of FCtrl is 1 byte.
 */
function FCtrl(direction) {
    if (direction) {
        return new BitBuffer.concat([ADR(), ADRACKReq(), ACK(), RFU(), FOptsLen()])
    } else {
        return new BitBuffer.concat([ADR(), ADRACKReq(), ACK(). FPending(), FOptsLen()])
    }
}
/**
 * Each end-device has two frame counters to keep track of the number of data frames sent
 * uplink to the network server (FCntUp), incremented by the end-device and received by the
 * end-device downlink from the network server (FCntDown), which is incremented by the
 * network server. The network server tracks the uplink frame counter and generates the
 * downlink counter for each end-device. After a join accept, the frame counters on the end-
 * device and the frame counters on the network server for that end-device are reset to 0.
 * Subsequently FCntUp and FCntDown are incremented at the sender side by 1 for each data
 * frame sent in the respective direction. At the receiver side, the corresponding counter is
 * kept in sync with the value received provided the value received has incremented compared
 * to the current counter value and is less than the value specified by MAX_FCNT_GAP 1 after
 * considering counter rollovers. If this difference is greater than the value of MAX_FCNY_GAP
 * then too many data frames have been lost then subsequent will be discarded.
 * The LoRaWAN allows the use of either 16-bits or 32-bits frame counters. The network side
 * needs to be informed out-of-band about the width of the frame counter implemented in a
 * given end-device. If a 16-bits frame counter is used, the FCnt field can be used directly as
 * the counter value, possibly extended by leading zero octets if required. If a 32-bits frame
 * counter is used, the FCnt field corresponds to the least-significant 16 bits of the 32-bits
 * frame counter (i.e., FCntUp for data frames sent uplink and FCntDown for data frames sent
 * downlink).  */
function FCnt() {

}

/**
 * FOpts transport MAC commands of a maximum length of 15 octets that are piggybacked
 * onto data frames; see Chapter  4.4 for a list of valid MAC commands.
 *
 */
function FOpts() {

}


/**
 * LoRa network allows the end-devices to individually use any of the possible data rates. This
 * feature is used by the LoRaWAN to adapt and optimize the data rate of static end-devices.
 * This is referred to as Adaptive Data Rate (ADR) and when this is enabled the network will be
 * optimized to use the fastest data rate possible.
 *
 * Mobile end-devices should use their fixed default data rate as data rate management is not
 * practical when the moving end-device causes fast changes in the radio environment.
 * If the ADR bit is set, the network will control the data rate of the end-device through the
 * appropriate MAC commands. If the ADR bit is not set, the network will not attempt to control
 * the data rate of the end-device regardless of the received signal quality. The ADR bit may
 * be set and unset by the end-device or the Network on demand. However, whenever
 * possible, the ADR scheme should be enabled to increase the battery life of the end-device
 * and maximize the network capacity.
*/
function ADR() {

}

/**
 * If an end-device whose data rate is optimized by the network to use a data rate higher than
 * its default data rate, it periodically needs to validate that the network still receives the uplink
 * frames. Each time the uplink frame counter is incremented (for each new uplink, repeated
 * transmissions do not increase the counter), the device increments an ADR_ACK_CNT
 * counter. After ADR_ACK_LIMIT uplinks (ADR_ACK_CNT >= ADR_ACK_LIMIT) without any
 * downlink response, it sets the ADR acknowledgement request bit (ADRACKReq).
 */
function ADRACKReq() {

}
/**
 * The downlink ACK bit does not need to be set as any response
 * during the receive slot of the end-device indicates that the gateway has still received the
 * uplinks from this device.
 */
function ACK() {

}

/**
 * The frame pending bit (FPending) is only used in downlink communication, indicating that
 * the gateway has more data pending to be sent and therefore asking the end-device to open
 * another receive window as soon as possible by sending another uplink message.
 * The exact use of FPending bit is described in Chapter 18.3.
 */
function FPending() {

}
/**
 * The frame-options length field (FOptsLen) in FCtrl byte denotes the actual length of the
 * frame options field (FOpts) included in the frame.
 */
function FOptsLen() {

}
