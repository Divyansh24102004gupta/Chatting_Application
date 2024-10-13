import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

// export const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "invalid credentials!",
//       });
//     }
//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) {
//       return res.status(400).json({
//         success: false,
//         message: "invalid credentials!",
//       });
//     }
//     generateTokenAndSetCookie(user._id, res);

//     return res.status(200).json({
//       success: true,
//       message: "user logged in successfully!",
//       _id: user._id,
//       fullName: user.fullName,
//       profilePic: user.profilePic,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Sorry, user do not logged in successfully!",
//     });
//   }
// };

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({
      success: true,
      message: "user logged out successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Sorry, user does not logged out successfully!",
    });
  }
};

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password do not match!",
      });
    }
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "username already exist!",
      });
    }

    //hash passwor here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //http://avatar
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (!newUser) {
      return res.status(400).json({
        success: false,
        message: "Sorry, user does not registered successfully!",
      });
    }

    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "user registered successfully!",
      _id: newUser._id,
      fullName: newUser.fullName,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "some error occoured while registering user!",
      error,
    });
  }
};
