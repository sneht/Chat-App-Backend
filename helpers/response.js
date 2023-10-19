const { STR_BAD_REQUEST } = require("../utils/const");
const {
  getErrResponseMessage,
} = require("./responseMessages/responseMessages");

exports.success = (
  res,
  data,
  messageCode,
  message,
  languageCode = "en",
  statusCode = 200
) => {
  const resData = {
    success: true,
    messageCode: messageCode,
    statusCode: statusCode,
    data,
    message: message,
  };
  return res.status(statusCode).send(resData);
};

exports.keyAlreadyExist = (
  res,
  data,
  messageCode,
  message,
  languageCode = "en",
  statusCode = 400
) => {
  const resData = {
    success: false,
    messageCode: messageCode,
    statusCode: statusCode,
    data,
    message: message,
  };
  return res.status(statusCode).send(resData);
};

exports.sendUnexpected = (
  res,
  data,
  messageCode,
  message,
  languageCode = "en",
  statusCode = 500
) => {
  const resData = {
    success: false,
    messageCode: messageCode,
    statusCode: statusCode,
    data,
    message: message,
  };
  return res.status(statusCode).send(resData);
};

exports.sendJoiError = (
  res,
  code = "",
  languageCode = "en",
  err,
  statusCode = 400
) => {
  let JoiError = _.map(err.details, ({ message, context, type, path }) => ({
    message: message.replace(/['"]/g, ""),
    type,
    path,
  }));
  let messageDisplay = getErrResponseMessage(code, languageCode, "DEFAULTERR");
  if (JoiError && JoiError.length > 0 && JoiError[0].message) {
    messageDisplay = JoiError[0].message;
  }
  let response = {
    success: false,
    message: messageDisplay,
    data: {},
    messageCode: code,
  };
  return res.status(statusCode).send(response);
};

exports.failure = (
  res,
  message,
  messageCode = STR_BAD_REQUEST,
  statusCode = 400
) => {
  const resData = {
    success: false,
    statusCode: statusCode,
    messageCode: messageCode,
    data: null,
    message: message,
  };
  return res.status(statusCode).send(resData);
};

exports.unAuthentication = (
  res,
  data,
  message = "Token not found",
  statusCode = 401
) => {
  const resData = {
    success: false,
    statusCode: statusCode,
    messageCode: "AUTHENTICATION_FAILED",
    data,
    message: message,
  };
  return res.status(statusCode).send(resData);
};

exports.handelError = (res, error, languageCode = "en", data = {}) => {
  let response = {
    success: false,
    statusCode: 400,
    data,
    message: getErrResponseMessage("okj", languageCode, ""),
    messageCode: "fff",
  };
  return res.status(400).send(response);
};

exports.send = (
  res,
  languageCode = "en",
  message = "",
  statusCode = 203,
  data = {}
) => {
  let response = {
    success: false,
    statusCode: statusCode,
    data,
    message: message,
    messageCode: getErrResponseMessage(message, languageCode, "DEFAULTERR"),
  };
  return res.status(statusCode).send(response);
};

exports.sendForbidden = (res, data, languageCode = "en", statusCode = 403) => {
  const resData = {
    success: false,
    statusCode: statusCode,
    messageCode: "FORBIDDEN_ERROR",
    data,
    message: "You don't have permission to access this resource",
  };
  return res.status(statusCode).send(resData);
};
