const { phone } = require('phone')
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()

module.exports = {
  validate: (number) => {
    try {
      const countryCode = phone(number, {
        validateMobilePrefix: true,
        strictDetection: false
      })
      const parsedNumber = phoneUtil.parseAndKeepRawInput(
        number,
        countryCode.countryIso2
      )
      return {
        code: `+${parsedNumber.getCountryCode().toString()}`,
        number: parsedNumber.getNationalNumber().toString()
      }
    } catch (error) {
      console.log(' ----- error ---- ', error)
    }
  }
}
