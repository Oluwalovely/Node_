const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODE_MAIL,
    pass: process.env.NODE_PASS,
  },
});

const createUser = async (req, res) => {
  const { lastName, firstName, email, password } = req.body;

  try {
    const saltround = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, saltround);

    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });
    res.status(201).send({
      message: "User created successfully",
      data: {
        lastName,
        email,
        firstName,
        roles: user.roles,
      },
      token,
    });

    let mailOptions = {
      from: process.env.NODE_MAIL,
      to: email,
      subject: `Welcome ${firstname},to our platform`,
      html: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial, sans-serif; line-height: 1.6; }
.container { max-width: 600px; margin: 0 auto; padding: 20px; }
.header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
.content { padding: 20px; }
.footer { background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; }
</style>
</head>
<body>
<div class="container">
<div class="header">
<h1>Hello, <%= name %>!</h1>
</div>

<div class="content">
<p>Thank you for signing up with <strong><%= companyName %></strong>.</p>

</div>

<div class="footer">
<p>This email was sent by <%= companyName %> &copy; <%= new Date().getFullYear() %></p>
</div>
</div>
</body>
</html>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  } catch (error) {
    console.log(error);

    if (error.code == 11000) {
      res.status(400).send({
        message: "User already registered",
      });
    } else {
      res.status(400).send({
        message: "Error creating user",
      });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const isUser = await UserModel.findOne({ email });
    if (!isUser) {
      res.status(404).send({
        message: "Invalid credentials",
      });

      return;
    }
    const isMatch = await bcrypt.compare(password, isUser.password);
    if (!isMatch) {
      res.status(404).send({
        message: "Invalid credentials",
      });

      return;
    }

    const token = await jwt.sign({ id: isUser._id, roles: isUser.roles }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });
    res.status(200).send({
      message: "User logged in successfully",
      data: {
        email: isUser.email,
        roles: isUser.roles,
        firstName: isUser.firstName,
        lastName: isUser.lastName,
      },
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(404).send({
      message: "Invalid credentials",
    });
  }
};

const editUser = async (req, res) => {
  const { firstName, lastName } = req.body;
  const { id } = req.params;
  try {
    let allowedUpdate = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
    };
    const newUser = await UserModel.findByIdAndUpdate(id, allowedUpdate);
    res.status(200).send({
      message: "User updated successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: "User update failed",
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    let deletedUser = await UserModel.findByIdAndDelete(id);
    res.status(204).send({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: "User not deleted successfully",
    });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    let user = await UserModel.findById(id).select("-password -roles");
    res.status(200).send({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: "User not retrieved successfully",
    });
  }
};

const getAllUsers = async (req, res) => {
  const user = req.user.roles
  try {

    if (user !== 'admin') {
      res.status(403).send({
        message: "Forbidden request"
      })

      return
    }
    let allUsers = await UserModel.find().select("-password -roles");
    res.status(200).send({
      message: "All users retrieved successfully",
      data: allUsers,
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: "Users not retrieved successfully",
    });
  }
};

const verifyUser = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1]
    ? req.headers["authorization"].split(" ")[1]
    : req.headers["authorization"].split(" ")[0];

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      res.status(401).send({
        message: "user unauthorized",
      });
      return;
    }

    console.log(decoded);

    req.user = decoded;

    next();
  });
};

const getMe = async (req, res) => {
  console.log(req.user.id);

  try {
    const user = await UserModel.findById(req.user.id).select("-password");

    res.status(200).send({
      message: "user retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);

    res.status(404).send({
      message: "user not found",
    });
  }
};

module.exports = {
  createUser,
  editUser,
  deleteUser,
  getUser,
  getAllUsers,
  login,
  verifyUser,
  getMe
};
