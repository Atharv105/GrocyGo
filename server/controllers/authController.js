const bcrypt = require("bcrypt");
const { generateToken } = require("../config/jwt");
const db = require("../models");

const User = db.User;

// =========================
// Register User
// =========================
const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if all fields are provided
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            phone,
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
                email: user.email,
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
        const { email, password } = req.body;

        // Check if all fields are provided
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        const user = await User.findOne({
            where: { email },
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
                email : user.email,
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

module.exports = {
    register,
    login
};
