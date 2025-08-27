const bcrypt = require('bcryptjs')
module.exports = {
  generateHashPassword: async (password) =>
    bcrypt.hashSync(password, +process.env.SALT),
  generate: async (password) => bcrypt.hashSync(password, +process.env.SALT),
  compare: async (password, hashPassword) =>
    bcrypt.compareSync(password, hashPassword)
}
