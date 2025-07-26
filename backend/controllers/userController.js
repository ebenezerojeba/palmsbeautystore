import validator from "validator";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointment.js";
// import { configDotenv } from "dotenv";
// configDotenv()
// 
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

// Route for Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.status(200).json({ 
      success: true, 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
    

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: "Password must be at least 8 characters" 
      });
    }

    // Check if user exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.status(201).json({ 
      success: true, 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};



// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const {email,password} = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success: true, token})
        }
        else{
            res.json({success: false, message: "Invalid Credentials"})
        }


    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


// API to update the  user profile

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    // Validate required fields
    if (!name || !phone || !gender || !dob) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Prepare update data with proper date handling
    const updateData = { 
      name, 
      phone, 
      dob: new Date(dob), // Ensure dob is stored as Date object
      gender 
    };

    // Handle address
    if (address) {
      try {
        updateData.address = typeof address === 'string' ? JSON.parse(address) : address;
        // Ensure address has consistent structure
        updateData.address = {
          line1: updateData.address.line1 || '',
          line2: updateData.address.line2 || ''
        };
      } catch (err) {
        console.error("Address parsing error:", err);
        updateData.address = { line1: '', line2: '' };
      }
    }

    // Update user data
    let updatedUser = await userModel.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true } // Return the updated document
    );

    // Handle image upload if present
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
        folder: "user-profiles"
      });
      updatedUser = await userModel.findByIdAndUpdate(
        userId, 
        { image: imageUpload.secure_url },
        { new: true }
      );
    }

    // Format the response data with safe date handling
    const responseData = {
      ...updatedUser._doc,
      dob: updatedUser.dob instanceof Date 
        ? updatedUser.dob.toISOString().split('T')[0] 
        : new Date(updatedUser.dob).toISOString().split('T')[0]
    };

    res.json({ 
      success: true, 
      message: "Profile updated successfully", 
      user: responseData 
    });

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// API to get userData if it's verified or not
const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "USer not found" });
    }
    res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to crete user profile data

const getProfile = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId).select("-password");
    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};






export {loginUser, registerUser, adminLogin, listAppointment, updateProfile, getUserData, getProfile };