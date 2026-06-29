const bcrypt = require("bcrypt");
const { generateToken } = require("../config/jwt");
const db = require("../models");

const User = db.User;

// =========================
// Register User
// =========================
const register = async (req, res) => {
    try {
        const { name, mobile, password } = req.body;

        // Check if all fields are provided
        if (!name || !mobile || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Validate mobile number length
        if (mobile.length !== 10) {
            return res.status(400).json({
                success: false,
                message: "Mobile number must be exactly 10 digits",
            });
        }
        // Check if mobile number already exists
        const existingUser = await User.findOne({
            where: { mobile },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "mobile number already registered",
            });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            mobile,
            password: hashedPassword,
        });

        // Generate JWT
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user.id,
                name: user.name,
                mobile: user.mobile,
                role: user.role,
            },
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// =========================
// Login User
// =========================

const login = async (req, res) => {
    try {
        const { mobile, password } = req.body;

        // Check if all fields are provided
        if (!mobile || !password) {
            res.status(400).json({
                success: false,
                message: "mobile number and Password are required"
            });
        }

        const user = await User.findOne({
            where: { mobile },
        });

        if(!user){
            res.status(400).json({
                success: false,
                message : "User not found",
            });
        }

        //compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            res.status(401).json({
                success: false,
                message : "Invalid password",
            });
        }

        //Generate JWT
        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user:{
                id : user.id,
                name : user.name,
                mobile : user.mobile,
                role : user.role,
            }
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

// =========================
// Get Logged In User
// =========================
const profile = async (req, res) => {
  try {

    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ["password"],
      },
    });

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// =========================
// Update User Profile
// =========================
const updateProfile = async (req, res) => {
  try {
    const { name, mobile } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Name and Mobile number are required",
      });
    }

    if (mobile.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Mobile number must be exactly 10 digits",
      });
    }

    // Check if mobile number is already taken by another user
    const existingUser = await User.findOne({
      where: { mobile },
    });
    if (existingUser && existingUser.id !== req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already in use by another user",
      });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name;
    user.mobile = mobile;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
    register,
    login,
    profile,
    updateProfile
};

