const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const Service = require("./user.services.js");
const {User} = require('./user.model');
const path = require('path');
const multer = require('multer');
const commonResponse = require('../../helper/commonResponse');
const {OtpModel} = require('./user.model');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const secret = process.env.JWT_SECRET

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');  // Directory to store the images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Name the file with a timestamp
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
}).single('profileImage');  // Only allow single image upload with the field name 'image'



// Validation Schema for registration
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Register user with image upload
const registerUser = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return commonResponse.customResponse(res, "UPLOAD_ERROR", 400, {}, err.message);
    }

    const { error } = registerSchema.validate(req.body);  // Validate request body
    if (error) {
      return commonResponse.customResponse(res, "VALIDATION_ERROR", 400, {}, error.details[0].message);
    }
    const { username, email, password } = req.body;

    try {
      // Check if the user already exists
      let user = await User.findOne({ email });
      if (user) {
        return commonResponse.customResponse(res, "USER_EXISTS", 400, {}, 'User already registered.');
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // If file is uploaded, save its path, else return error
      const imagePath = req.file ? req.file.path : null;
      if (!imagePath) {
        return commonResponse.customResponse(res, "IMAGE_REQUIRED", 400, {}, 'Profile image is required.');
      }

      console.log("Image uploaded: ", imagePath); 
      
      // Create a new user
      user = new User({
        username,
        email,
        password: hashedPassword,
        profileImage: imagePath  // Save image path in user schema
      });
      await user.save();

      return commonResponse.customResponse(res, "SUCCESS", 201, { userId: user._id }, 'User registered successfully.');
    } catch (err) {
      console.error(err);  // Log the error for debugging
      return commonResponse.customResponse(res, "SERVER_ERROR", 500, {}, 'Server error.');
    }
  });
};



const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Service.get(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Include user's role in the JWT token
    const token = jwt.sign({ _id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'rudrarudra', { expiresIn: '1h' });

    return res.status(200).json({ _id: user._id, email: user.email, token });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
};



// Update User

const updateUser = async (req, res) => {
  // Multer setup for image upload (reuse the previous multer configuration)
  upload(req, res, async function (err) {
    if (err) {
      return commonResponse.customResponse(res, "UPLOAD_ERROR", 400, {}, err.message);
    }

    // Validation schema for updating username and profileImage only
    const updateSchema = Joi.object({
      username: Joi.string().min(3).max(30),  // Only allow updating username
    }).min(1);  // Require at least one field to update

    const { error } = updateSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return commonResponse.customResponse(res, "VALIDATION_ERROR", 400, {}, error.details.map(detail => detail.message).join(', '));
    }

    try {
      // Ensure req.params.id is a valid MongoDB ObjectId
      const userId = req.params.id;
      if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        return commonResponse.customResponse(res, "INVALID_ID", 400, {}, 'Invalid user ID.');
      }

      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return commonResponse.customResponse(res, "USER_NOT_FOUND", 404, {}, 'User not found.');
      }

      // Prevent updating email and password
      if (req.body.email || req.body.password) {
        return commonResponse.customResponse(res, "UPDATE_RESTRICTED", 400, {}, 'Email and password cannot be updated.');
      }

      // Update profile image if a new image is uploaded
      const imagePath = req.file ? req.file.path : user.profileImage;  // Keep old image if no new image is uploaded

      // Update username and profile image
      const updatedData = {
        username: req.body.username || user.username,  // Update if provided
        profileImage: imagePath  // Update image if provided
      };

      // Update the user in the database
      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true, runValidators: true });
      if (!updatedUser) {
        return commonResponse.customResponse(res, "USER_NOT_FOUND", 404, {}, 'User not found.');
      }

      // Return success response
      return commonResponse.customResponse(res, "SUCCESS", 200, {
        username: updatedUser.username,
        profileImage: updatedUser.profileImage,
      }, 'User updated successfully.');
    } catch (err) {
      console.error(err);  // Log the error for debugging
      return commonResponse.customResponse(res, "SERVER_ERROR", 500, {}, 'Server error.');
    }
  });
};


const listOfUsers = async (req, res) => {
  try {
    let listAll = await User.find({});
    console.log(listAll);
    if (!listAll || listAll.length === 0) {
        return commonResponse.customResponse(res, "SERVER_ERROR", 404, {}, "No users found.");
    }
    
    // Map through users to format the response
    const userList = listAll.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email
    }));

    return commonResponse.success(res, "USER_GET", 200, userList, "Success");
  } catch (error) {
    console.error('Error retrieving users:', error);
    return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {}, error.message);
  }
};



// // List User by ID
const getUserById = async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findById(req.params.id);

    // If the user is not found, return a 404 error
    if (!user) {
      return commonResponse.customResponse(res, "USER_NOT_FOUND", 404, {}, 'User not found.');
    }

    // Return the user data with a success status
    return commonResponse.customResponse(res, "SUCCESS", 200, user, 'User fetched successfully.');
    
  } catch (err) {
    // Handle server errors
    console.error(err);  // Log error for debugging
    return commonResponse.customResponse(res, "SERVER_ERROR", 500, {}, 'Server error.');
  }
};


// // Delete User
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Soft delete the user using the delete method provided by the plugin
    const user = await User.delete({ _id: userId });
    if (!user) {
      return commonResponse.customResponse(res, "NOT_FOUND", 404, {}, 'User not found.');
    }

    return commonResponse.customResponse(res, "SUCCESS", 200, {}, 'User deleted successfully.');
  } catch (err) {
    console.error(err);
    return commonResponse.customResponse(res, "SERVER_ERROR", 500, {}, 'Server error.');
  }
};


const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    console.log('User found:', user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    // Generate OTP and set expiration time
    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration

    // Save OTP record to the database
    const otpRecord = new OtpModel({ email, otp, expiresAt: otpExpiration });
    await otpRecord.save();

    // Send OTP to the user's email
    await sendOTP(email, otp);

    // Respond to the request
    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Error in forgotPassword:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Generate OTP function
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
}

// Send OTP via email function
async function sendOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'OTP for Password Reset',
    text: `Your OTP for password reset is ${otp}. It will expire in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending OTP:', err);
    throw new Error('Failed to send OTP');
  }
}

// Change Password using OTP
const changePasswordWithOTP = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Email, OTP, and new password are required' });
  }

  try {
    const otpRecord = await OtpModel.findOne({ email, otp });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ email:email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', user);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();
    
    // Delete OTP record after successful password change
    await OtpModel.deleteOne({ email, otp });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error in changePasswordWithOTP:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  listOfUsers,
  getUserById,
  deleteUser,
  forgotPassword,
  changePasswordWithOTP
};
