var _ = require("lodash");
const languageCodeArray = ["en", "hi"];
/**
 *
 * @param {String} code : Key identifier
 * @param {*} defaultcode : Default error code type
 */
const getSuccessResponseMessage = (
  code,
  languageCode = "en",
  defaultcode = "DEFAULT"
) => {
  return getMessage(code, languageCode, defaultcode);
};

/**
 *
 * @param {String} code : Key identifier
 * @param {*} defaultcode : Default error code type
 */
const getErrResponseMessage = (
  code,
  languageCode = "en",
  defaultcode = "DEFAULTERR"
) => {
  return getMessage(code, languageCode, defaultcode);
};

/**
 *
 * @param {String} code : Key identifier
 * @param {*} defaultcode : Default error code type
 */
const getConstantMessage = (
  code,
  languageCode = "en",
  defaultcode = "DEFAULTERR"
) => {
  return getMessage(code, languageCode, defaultcode);
};

function getMessage(code, languageCode, defaultcode) {
  languageCode =
    languageCodeArray.indexOf(languageCode) !== -1 ? languageCode : "en";
  let messageFile = _.defaults(require("./" + languageCode + ".json"), {});
  return messageFile[code] ? messageFile[code] : messageFile[defaultcode];
}

module.exports = {
  getSuccessResponseMessage,
  getErrResponseMessage,
  getConstantMessage,
};
