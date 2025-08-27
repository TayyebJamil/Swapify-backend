const moment = require('moment')
const RoleConstant = require('../../config/role')

module.exports = {
  booleanCheck: (check, value) => {
    if (check) return value
    else return ''
  },
  covertToLocalTime: (value) => value.toLocaleString(),
  checkIfStart: (checkDate, value1, value2) => {
    const currentDate = moment().toDate()
    if (currentDate > checkDate) return value1
    else return value2
  },
  conditionalTD: (condition, successColor, failColor) => {
    if (condition) return `color:${successColor}`
    else return `color:${failColor}`
  },
  checkIfNull: (condition, success, fail) => {
    if (condition) return success?.sportId?.name
    else return fail
  },
  dateFormater: (date) => moment(date).format('YYYY-MM-DD HH:MM'),
  ifElseCondition: (condition, value, value2) => {
    if (condition) return value
    else return value2
  },
  role: (role) => {
    if (role === RoleConstant.admin) return RoleConstant.admin
    else if (role === RoleConstant.agent) return RoleConstant.agent
    else if (role === RoleConstant.saleAssociate) return RoleConstant.sale
  }
}
