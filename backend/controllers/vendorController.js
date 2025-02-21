const { Vendor } = require('../models/vendorModel')
const { VendorInviteCode } = require('../models/vendorInviteModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const crypto = require("crypto");

// Test REPS

// Create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
  };
  
  const registerVendor = async (req, res) => {
    const { invite_code, name, email, password } = req.body;
  
    // Validate if email and other fields are present
    if (!email || !invite_code || !name || !password) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    try {
        // Check if the invite code exists and is unused
        const validCode = await VendorInviteCode.findOne({
            where: { code: invite_code, status: 'unused' }
        });

        if (!validCode) {
            return res.json({ success: false, message: 'Invalid or already used invite code' });
        }

        // Check if user already exists
        const exists = await Vendor.findOne({ where: { email } });
        if (exists) {
            return res.json({ success: false, message: 'Email already exists' });
        }

        // Validate email format and password strength
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Invalid email format' });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: 'Password must be at least 8 characters' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newVendor = await Vendor.create({
            invite_code,
            name,
            email,
            password: hashedPassword,
        });

        // Mark invite code as used
        await validCode.update({ status: 'used' });

        // Create token
        const token = createToken(newVendor.id);

        // Respond with success and token
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Server error' });
    }
};

  // Login user
const loginVendor = async (req, res) => {
    const { email, password } = req.body;
  
    // Validate if email and password are present
    if (!email || !password) {
      return res.json({ success: false, message: 'All fields are required' });
    }
  
    try {
      // Check if user exists
      const vendor = await Vendor.findOne({ where: { email } });
      if (!vendor) {
        return res.json({ success: false, message: "User doesn't exist" });
      }
  
      // Check if password is correct
      const validPassword = await bcrypt.compare(password, vendor.password);
      if (!validPassword) {
        return res.json({ success: false, message: 'Invalid credentials' });
      }
  
      // Create token
      const token = createToken(vendor.id);
  
      // Respond with success and token
      res.json({ success: true, token });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: 'Error' });
    }
  };

const generateInviteCode = async (req, res) => {
    try {
        let inviteCode;
        let exists = true;

        // Keep generating until a unique code is found
        while (exists) {
            inviteCode = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6-char code
            const existingCode = await VendorInviteCode.findOne({ where: { code: inviteCode } });
            exists = !!existingCode; // If exists, generate again
        }

        // Save to database
        await VendorInviteCode.create({ code: inviteCode, status: 'unused' });

        return res.status(201).json({ inviteCode });
    } catch (error) {
        console.error("Error generating invite code:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    generateInviteCode,
    registerVendor,
    loginVendor,
}
