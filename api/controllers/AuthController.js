const { User } = require("../models/UserModel");

exports.registerUser = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const user = new User({
      email,
      password,
      userType
    });
    const newUser = await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        userType: newUser.userType,
        creationDate: newUser.creationDate
      }
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    const token = user.generateToken();
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token: token
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "An error occurred",
      error: err
    });
  }
};

exports.getUser = async (req, res) => {
  console.log(req.user);
  try {
    const user = await User.findById(req.user.id).select("-password");
    // We can do the same thing using projection
    // const user = await User.findById(req.user.id, { password: 0 });

    if (!user) {
      return res.status(400).send("User not found");
    }
    
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: {
        user: user
      }
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "An error occurred",
      error: err
    });
  }
};
