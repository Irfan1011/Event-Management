const express = require("express");
const { add, get } = require("../data/user");
const {
  createJSONToken,
  isValidPassword,
  validateJSONToken,
} = require("../util/auth");
const { isValidEmail, isValidText } = require("../util/validation");
const { NotAuthError } = require("../util/errors");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const data = req.body;
  let errors = {};

  if (!isValidEmail(data.email)) {
    errors.email = "Invalid email.";
  } else {
    try {
      const existingUser = await get(data.email);
      if (existingUser) {
        errors.email = "Email exists already.";
      }
    } catch (error) {}
  }

  if (!isValidText(data.password, 6)) {
    errors.password = "Invalid password. Must be at least 6 characters long.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "User signup failed due to validation errors.",
      errors,
    });
  }

  try {
    const createdUser = await add(data);
    const authToken = createJSONToken(createdUser.email);
    res
      .status(201)
      .json({ message: "User created.", user: createdUser, token: authToken });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let user;
  try {
    user = await get(email);
  } catch (error) {
    return res
      .status(401)
      .json({
        message: "Authentication failed.",
        errors: { credentials: "Could not find user for email " + email },
      });
  }

  const pwIsValid = await isValidPassword(password, user.password);
  if (!pwIsValid) {
    return res.status(422).json({
      message: "Invalid credentials.",
      errors: { credentials: "Invalid email or password entered." },
    });
  }

  const token = createJSONToken(email);
  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
    })
    .json({ token });
});

router.post("/logout", (req, res, next) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
    })
    .status(200)
    .json({ message: "Logged Out" });
});

router.get("/isAuth", (req, res, next) => {
  if (!req.cookies.token) return next(new NotAuthError("Not authenticated."));

  const authToken = req.cookies.token;
  try {
    const validatedToken = validateJSONToken(authToken);
    req.token = validatedToken;
  } catch (error) {
    return next(new NotAuthError("Not authenticated."));
  }

  res.status(200).json({ message: "Authenticated" });
});

module.exports = router;
