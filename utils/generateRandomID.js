/** Random ID Generator */
const randomId = require('random-id');
const length = 20;
const pattern = '0'; // generates Id only with numbers

module.exports = () => randomId(length, pattern);