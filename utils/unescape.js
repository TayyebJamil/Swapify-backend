const validator = require('validator')
module.exports = {
  unescapeText: (text) => validator.unescape(text)
}
