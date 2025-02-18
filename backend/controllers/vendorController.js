const { sequelize } = require('../models/userModel');
const { VendorInviteCode } = require('../models/vendorInviteModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const crypto = require("crypto");

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
}
