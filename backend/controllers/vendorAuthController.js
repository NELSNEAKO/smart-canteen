const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const vendorModel = require('../models/vendorModel');
const transporter = require('../config/nodemailer');

const vendorRegister = async (req, res) => {
    const { invite_code, name, email, password } = req.body;

    if (!invite_code || !name || !email || !password) {
        return res.json({ success: false, message: "Missing Details!" });
    }

    try {
        // 1️⃣ Check if vendor already exists by email
        const existingVendor = await vendorModel.findOne({ email });
        if (existingVendor) {
            return res.json({ success: false, message: "Vendor already exists!" });
        }


        // 2️⃣ Hash Password
        const hashedPassword = await bcrypt.hash(password, 8);

        // 3️⃣ Update the existing vendor entry instead of creating a new one
        const updatedVendor = await vendorModel.findOneAndUpdate(
            { "invite_code.code": invite_code},
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

        if (!updatedVendor) {
            return res.json({ success: false, message: "Invalid or already used invite code!" });
        }

        // 4️⃣ ✅ Corrected Token Generation
        const token = jwt.sign(
            { id: updatedVendor._id, vendorype: "vendor" }, // ✅ Fix: Use updatedVendor
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 5️⃣ Set Secure Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // 6️⃣ Sending Welcome Email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome Vendors to SmartCanteen",
            text: `Welcome to SmartCanteen! Your account has been created with email: ${email}.`,
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Registration successful", token });

    } catch (error) {
        console.error("Vendor Registration Error:", error);
        return res.json({ success: false, message: error.message });
    }
};

const vendorLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email and password are required!" });
    }

    try {
        const vendor = await vendorModel.findOne({ email });

        if (!vendor) {
            return res.json({ success: false, message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        // ✅ Use vendor._id instead of vendorodel._id
        const token = jwt.sign(
            { id: vendor._id, vendorype: "vendor" },  // Include vendorype
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            secure: false,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.json({ success: true, message: "Login successful", token, vendorype: 'vendor' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


const logout = async (req, res) =>{
    try {
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({success:true, message: 'Logged out'})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

const sendVerifyOtp = async (req, res) => {
    try {
        const { vendorId } = req.body;

        // Check if vendor exists
        const vendor = await vendorModel.findById(vendorId);
        if (!vendor) {
            return res.json({ success: false, message: "vendor not found" });
        }   

        // Check if account is already verified
        if (vendor.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified" });
        }

        // Generate a 6-digit OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000)); 

        // Save OTP and expiration time
        vendor.verifyOtp = otp;
        vendor.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        await vendor.save();

        // Email options
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: vendor.email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`
        };

        // Send OTP via email
        await transporter.sendMail(mailOption);
        
        res.json({ success: true, message: 'Verification OTP sent to email' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


const verifyEmail = async (req, res)=>{
    const {vendorId, otp} = req.body;

    if(!vendorId || !otp){
        return res.json({success:false, message: 'Missing Details'});
    }
    
    try {
        const vendor = await vendorModel.findById(vendorId);

        if(!vendor){
            return res.json({success:false, message: 'vendornot Found'});
        }

        if(vendor.verifyOtp === '' || vendor.verifyOtp !== otp){
            return res.json({success:false, message: 'Invalid OTP'});
        }

        if(vendor.verifyOtpExpireAt < Date.now()){
            return res.json({success:false, message: 'OTP Expired'});
        }

        vendor.isAccountVerified = true;
        vendor.verifyOtp = '';
        vendor.verifyOtpExpireAt = 0;

        await vendor.save();

        return res.json({success:true, message: 'Email verified successfully'});



    } catch (error) {
        return res.json({success:false, message: error.message});
    }
}

const isAuthenticated = async (req, res)=>{
    try {
        return res.json({success: true})
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}

// Send Password Reset OTP
const sendResetOtp = async (req, res)=>{
    const { email } = req.body;

    if(!email){
        return res.json({success: false, message: "Emai is required"})

    }
    
    try {
        
        const vendor = await vendorModel.findOne({email});
        if(!vendor){
            return res.json({success: false, message: "vendor not found"})
        }

        if(!vendor.isAccountVerified){
            return res.json({success: false, message: "Account is not Verified"})
        }

        // Generate a 6-digit OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000)); 

        // Save OTP and expiration time
        vendor.resetOtp = otp;
        vendor.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        await vendor.save();

        // Email options
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: vendor.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for resseting your password is  ${otp}. Use this OTP to proceed with resetting your password.`
        };

        // Send OTP via email
        await transporter.sendMail(mailOption);

        return res.json({success: true, message: "OTP sent to your email"});
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

// Reser vendor Password
const vendorResetPass = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Email, OTP, and new password are required" });
    }

    try {
        const vendor = await vendorModel.findOne({ email });
        if (!vendor) {
            return res.json({ success: false, message: "vendor not found" });
        }

        if (vendor.resetOtp === "" || vendor.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (vendor.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 8);

        vendor.password = hashedPassword;
        vendor.resetOtp = '';
        vendor.resetOtpExpireAt = 0;

        await vendor.save();

        return res.json({ success: true, message: "Password has been reset successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


module.exports = {
    vendorRegister,
    vendorLogin,
    logout,
    sendVerifyOtp,
    verifyEmail,
    isAuthenticated,
    vendorResetPass,
    sendResetOtp,
  };