const User = require("../models/user");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});
async function signup(req, res) {
  try {
    const { email, password, name } = req.body;
    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
      if (!emailExist.email_verified) {
        return res.status(400).json({
          success: false,
          message: "This email exist but not verified!",
          email_verified: false,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "This email already exist!",
          email_verified: true,
        });
      }
    }
    const user = await User.create({ email, password, name });
    return res.status(201).json({
      success: true,
      message: "User created successfully!",
      email: user.email,
      email_verified: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "interval server error!",
    });
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No such account exist!",
        user_found: false,
        email_verified: false,
      });
    }
    if (!user.email_verified) {
      return res.status(400).json({
        success: false,
        message: "Email not verified!",
        user_found: true,
        email_verified: false,
      });
    }
    if (await user.isValidatedPassword(password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, account_type: user.account_type },
        process.env.JWT_SECRET,
        {
          expiresIn: "3d",
        }
      );
      return res.status(200).json({
        success: true,
        message: "User logged in successfully!",
        user_found: true,
        email_verified: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          account_type: user.account_type,
          token: token,
        },
      });
    }
    return res.status(400).json({
      success: false,
      message: "Invalid credentials!",
      user_found: true,
      email_verified: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "interval server error!",
    });
  }
}

async function sendVerification(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No such account exist!",
        email_verified: true,
      });
    }
    if (user.email_verified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified!",
        email_verified: true,
      });
    }
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
    const info = await transporter.sendMail({
      from: process.env.APP_EMAIL, // sender address
      to: user?.email || email, // list of receivers
      subject: "Real State email verification", // Subject line
      html:
        " <p>This verification link will be active only for 15 minutes.</p> <a href='http://localhost:5173/verify?token=" +
        token +
        "'>Verify</a>", // html body
    });
    if (!info.messageId) {
      return res.status(400).json({
        success: false,
        message: "Email verification failed to sent!",
        email_verified: true,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Email verification sent!",
      email_verified: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "interval server error!",
    });
  }
}

async function verifyEmail(req, res) {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No token provided!",
        token_found: false,
      });
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const { id } = payload;
      await User.findByIdAndUpdate(id, {
        email_verified: true,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid token!",
        token_found: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      token_found: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "interval server error!",
    });
  }
}

module.exports = {
  signup,
  sendVerification,
  login,
  verifyEmail,
};
