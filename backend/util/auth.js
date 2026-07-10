const { sign, verify } = require("jsonwebtoken");
const { compare } = require("bcryptjs");
const { NotAuthError } = require("./errors");

const KEY = "supersecret";

function createJSONToken(email) {
  return sign({ email }, KEY, { expiresIn: "1h" });
}

function validateJSONToken(token) {
  return verify(token, KEY);
}

function isValidPassword(password, storedPassword) {
  return compare(password, storedPassword);
}

function checkAuthMiddleware(req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }
  if (!req.cookies.token) {
    console.log("NOT AUTH. TOKEN IS MISSING.");
    return next(new NotAuthError("Not authenticated."));
  }
  // const authFragments = req.headers.authorization.split(' ');

  // if (authFragments.length !== 2) {
  //   console.log('NOT AUTH. AUTH HEADER INVALID.');
  //   return next(new NotAuthError('Not authenticated.'));
  // }
  // const authToken = authFragments[1];
  const authToken = req.cookies.token;
  try {
    const validatedToken = validateJSONToken(authToken);
    req.token = validatedToken;
  } catch (error) {
    console.log("NOT AUTH. TOKEN INVALID.");
    return next(new NotAuthError("Not authenticated."));
  }
  next();
}

exports.createJSONToken = createJSONToken;
exports.validateJSONToken = validateJSONToken;
exports.isValidPassword = isValidPassword;
exports.checkAuth = checkAuthMiddleware;
