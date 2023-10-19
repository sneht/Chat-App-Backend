const jwt = require("jsonwebtoken");
const { unAuthentication, sendUnexpected } = require("./response");
const UserMeta = require("../models/usermeta.model");
const userModel = require("../models/users.model");
const jwtObj = {
  SECRET: "JWT@TOKEN#CHATAPP",
  EXPIRY: "10h",
};

const createToken = ({ _id }) => {
  const payload = {
    _id,
  };
  return jwt.sign(payload, jwtObj.SECRET, {
    expiresIn: jwtObj.EXPIRY,
  });
};

const isAuthorized = async (req, res, next) => {
  try {
    const authorization =
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.slice(7, req.headers.authorization.length)
        : req.headers.authorization;
    const tokenExist = await UserMeta.findOne({
      token: authorization,
    });
    if (tokenExist) {
      try {
        const userInfo = jwt.verify(authorization, jwtObj.SECRET);
        if (tokenExist.user_id === userInfo._id) {
          const userDetails = await userModel.findById({
            _id: userInfo._id,
          });
          req.userDetails = userDetails;
          next();
        } else {
          return unAuthentication(res, {});
        }
      } catch (err) {
        return unAuthentication(res, {});
      }
    } else {
      return unAuthentication(res, {});
    }
  } catch (e) {
    return sendUnexpected(res, {}, "AUTHENTICATION_FAILED", e?.message);
  }
};

module.exports = {
  createToken,
  isAuthorized,
};
