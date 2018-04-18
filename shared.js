/*
* Shared lib
*/
'use strict';
function Shared() {
}

Shared.prototype.getRandomBytes = function (num) {
  let min = 0;
  let max = 255;
  let buffRandom = new Buffer(num);
  for (let i = min; i < num; i++) {
    buffRandom[i] = Math.random() * (max - min) + min;
  }
  return buffRandom;
}

module.exports(getRandomBytes) = getRandomBytes;
