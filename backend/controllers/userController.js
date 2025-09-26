import validator from "validator";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointment.js";
// import { configDotenv } from "dotenv";
// configDotenv()
// 

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d' // Token will expire in 1 hour
  });
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


// Fixed registerUser function
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body; // ✅ Added phone

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
      password: hashedPassword,
      phone 
    });

    const user = await newUser.save();
    const token = createToken(user._id);



    res.status(201).json({ 
      success: true, 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone // ✅ Added phone in response
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Fixed loginUser function
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
        email: user.email,
        phone: user.phone // ✅ Added phone in response
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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


// API to update user profile - supports partial updates
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    // Validate that userId is provided
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Check if user exists
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Build update data only with provided fields
    const updateData = {};

    // Only add fields that are provided in the request
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (gender !== undefined) updateData.gender = gender;
    
    // Handle DOB with proper date conversion
    if (dob !== undefined) {
      updateData.dob = new Date(dob);
    }

    // Handle address if provided
    if (address !== undefined) {
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

    // Update user data only if there are fields to update
    let updatedUser = existingUser;
    if (Object.keys(updateData).length > 0) {
      updatedUser = await userModel.findByIdAndUpdate(
        userId, 
        updateData, 
        { new: true } // Return the updated document
      );
    }

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

    // Check if any update was actually made
    if (Object.keys(updateData).length === 0 && !imageFile) {
      return res.status(400).json({ 
        success: false, 
        message: "No fields provided for update" 
      });
    }

    // Format the response data with safe date handling
    const responseData = {
      ...updatedUser._doc
    };

    // Format DOB for response if it exists
    if (responseData.dob) {
      responseData.dob = responseData.dob instanceof Date 
        ? responseData.dob.toISOString().split('T')[0] 
        : new Date(responseData.dob).toISOString().split('T')[0];
    }

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