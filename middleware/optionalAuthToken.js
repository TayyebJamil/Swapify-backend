const jwt = require('jsonwebtoken')
const UserModel = require('../models/User')

module.exports = (req, res, next) => {
    try {
        const authorizationHeaders =
            req.headers.authorization || req.headers.Authorization
        const jwtToken = authorizationHeaders
            ? `${authorizationHeaders}`.split('Bearer ')[1]
            : ''

        if (!jwtToken) next()
        else
            jwt.verify(jwtToken, process.env.TOKEN_KEY, async (err, decoded) => {
                if (!err) {
                    req.token = await UserModel.findOne({ _id: decoded?._id })
                    next()
                }
            })
    } catch (error) {
        console.log(' ----- error optional token---- ', error)
    }
}
