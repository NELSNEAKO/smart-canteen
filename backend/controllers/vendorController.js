const vendorModel = require('../models/vendorModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const crypto = require("crypto");

// Generate JWT Token
const createToken = (id, type) => {
    return jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// 📌 Register Vendor (Fixed)
const registerVendor = async (req, res) => {
    const { invite_code, name, email, password } = req.body;

    if (!email || !invite_code || !name || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // Check if invite code exists and is unused
        const existingVendorWithCode = await vendorModel.findOne({ "invite_code.code": invite_code, "invite_code.status": "unused" });

        if (!existingVendorWithCode) {
            return res.status(400).json({ success: false, message: 'Invalid or already used invite code' });
        }

        // Check if email already exists
        const exists = await vendorModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the existing vendor entry instead of creating a new one
        const updatedVendor = await vendorModel.findOneAndUpdate(
            { "invite_code.code": invite_code },
            {
                $set: {
                    name,
                    email,
                    password: hashedPassword,
                    "invite_code.status": "used"
                }
            },
            { new: true }
        );

        // Generate Token
        const token = createToken(updatedVendor._id, 'vendor');

        res.status(201).json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


// 📌 Login Vendor
const loginVendor = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const vendor = await vendorModel.findOne({ email });
        if (!vendor) {
            return res.status(404).json({ success: false, message: "User doesn't exist" });
        }

        const validPassword = await bcrypt.compare(password, vendor.password);
        if (!validPassword) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate Token
        const token = createToken(vendor._id, 'vendor');

        res.json({ success: true, token, userType: 'vendor' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// 📌 Generate Invite Code
const generateInviteCode = async (req, res) => {
    try {
        let inviteCode;
        let exists = true;

        // Keep generating until a unique code is found
        while (exists) {
            inviteCode = crypto.randomBytes(3).toString("hex").toUpperCase();
            const existingCode = await vendorModel.findOne({ "invite_code.code": inviteCode });
            exists = !!existingCode;
        }

        // Save invite code by creating a new vendor placeholder
        const newVendor = new vendorModel({
            name: "Placeholder Vendor",
            email: `placeholder_${inviteCode}@example.com`, // Temporary email
            password: "temp_password",
            invite_code: {
                code: inviteCode,
                status: "unused",
                created_at: new Date()
            }
        });

        await newVendor.save();

        res.json({ success: true, inviteCode });
    } catch (error) {
        console.error("Error generating invite code:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// 📌 Fetch Invite Codes
const fetchInviteCodes = async (req, res) => {
    try {
        // Fetch all invite codes along with their status
        const codes = await vendorModel.find({}, { "invite_code": 1, _id: 0 });

        // Map through the codes to extract only the invite code and status
        const inviteCodes = codes.map((vendor) => ({
            code: vendor.invite_code.code,
            status: vendor.invite_code.status
        }));

        res.json({ success: true, data: inviteCodes });
    } catch (error) {
        console.error("Error fetching invite codes:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getVendor = async (req, res) => {
    try {
        const vendor = await vendorModel.find({ "invite_code.status": "used" });

        if (!vendor) {
            return res.status(404).json({ success: false, message: "No vendor found with 'used' invite code" });
        }

        res.json({ success: true, vendor });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error retrieving vendor" });
    }
};

// Delete Vendor
const deleteVendor = async (req,res) =>{
    const {vendorId} = req.params;

    try {
        const vendor = vendorModel.findByIdAndDelete(vendorId);
        if(!vendor){
            return res.status(404).json({success: false, message: 'Vendor not found'})
        }
        res.json({ success: true, message: 'Vendor deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting vendor' });
    }
}



module.exports = {
    generateInviteCode,
    registerVendor,
    loginVendor,
    fetchInviteCodes,
    getVendor,
    deleteVendor,
};
