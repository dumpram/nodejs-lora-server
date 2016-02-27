/**
 * BitBuffer implementation.
 */
function BitBuffer(data, size) {
    if (!isValidSize(size)) {
        throw "Size must be between 1 and 8" 
    }
    this.data = data;
    this.size = size;
}

BitBuffer.prototype.getSize = function () {
    return this.size;
}

BitBuffer.prototype.getData = function () {
    return this.data;
}

BitBuffer.prototype.concat = function (list) {
    var listSize = 0;
    for (var i = 0; i < list.length; i++) {
        listSize +=  list[i].getSize(); 
    }
    if (!isValidSize(listSize)) {
        throw "Size must be between 1 and 8"
    }
    
    var bitCnt = 8;
    byte result = 0; 
    for (var i = 0; i < list.length; i++) {
        bitCnt -= list[i].getSize();
        result |= (list[i].getData() << bitCnt); 
    }
    return result;
}

function isValidSize(size) {
    if (!(size > 0 && size <= 8)) {
        return false; 
    }
    return true;
}