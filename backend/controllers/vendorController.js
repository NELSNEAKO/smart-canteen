const { Vendor } = require('../models/vendorModel')
const { VendorInviteCode } = require('../models/vendorInviteModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const crypto = require("crypto");

// Test REPS


const createToken = (id, type) => {
  return jwt.sign({ id, type }, "your_jwt_secret", { expiresIn: "1d" });
};

  
// 📌 Register Vendor
const registerVendor = async (req, res) => {
  const { invite_code, name, email, password } = req.body;

  if (!email || !invite_code || !name || !password) {
    return res.json({ success: false, message: 'All fields are required' });
  }

  try {
    const validCode = await VendorInviteCode.findOne({ where: { code: invite_code, status: 'unused' } });

    if (!validCode) {
      return res.json({ success: false, message: 'Invalid or already used invite code' });
    }

    const exists = await Vendor.findOne({ where: { email } });
    if (exists) {
      return res.json({ success: false, message: 'Email already exists' });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Invalid email format' });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendor = await Vendor.create({ invite_code, name, email, password: hashedPassword });

    await validCode.update({ status: 'used' });

    const token = createToken(newVendor.id, 'vendor'); // 🔹 Token with 'vendor' role
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Server error' });
  }
};

// login vendor
const loginVendor = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.json({ success: false, message: 'All fields are required' });
  }

  try {
      const vendor = await Vendor.findOne({ where: { email } });
      if (!vendor) {
          return res.json({ success: false, message: "User doesn't exist" });
      }

      const validPassword = await bcrypt.compare(password, vendor.password);
      if (!validPassword) {
          return res.json({ success: false, message: 'Invalid credentials' });
      }

      // 🔹 Create token with userType 'vendor'
      const token = jwt.sign(
          { id: vendor.id, userType: 'vendor' },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
      );

      res.json({ success: true, token, userType: 'vendor' });
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

const fetchInviteCodes = async (req, res) => {
    try {
        const codes = await VendorInviteCode.findAll();
        res.json({ success: true, data: codes });
    } catch (error) {
        console.error("Error fetching invite codes:", error);
    }
};

module.exports = {
    generateInviteCode,
    registerVendor,
    loginVendor,
    fetchInviteCodes,
}
