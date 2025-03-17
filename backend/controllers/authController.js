const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const transporter = require('../config/nodemailer');

const studentRegister = async (req, res) => {
    const { student_id, name, email, password } = req.body;

    if (!student_id || !name || !email || !password) {
        return res.json({ success: false, message: "Missing Details!" });
    }

    try {
        const existingStudent = await userModel.findOne({ email });

        if (existingStudent) {
            return res.json({ success: false, message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const student = new userModel({
            student_id,
            name,
            email,
            password: hashedPassword,
        });

        await student.save();

        // ✅ Corrected token generation
        const token = jwt.sign(
            { id: student._id, userType: "student" },  // Include userType
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

        // Sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to SmartCanteen",
            text: `Welcome to Smart Canteen website. Your account has been created with email ID: ${email}.`,
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Registration successful", token });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

const studentLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email and password are required!" });
    }

    try {
        const student = await userModel.findOne({ email });

        if (!student) {
            return res.json({ success: false, message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        // ✅ Use student._id instead of userModel._id
        const token = jwt.sign(
            { id: student._id, userType: "student" },  // Include userType
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

        return res.json({ success: true, message: "Login successful", token, userType: 'student' });

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
        const { studentId } = req.body;

        // Check if student exists
        const student = await userModel.findById(studentId);
        if (!student) {
            return res.json({ success: false, message: "Student not found" });
        }

        // Check if account is already verified
        if (student.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified" });
        }

        // Generate a 6-digit OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000)); 

        // Save OTP and expiration time
        student.verifyOtp = otp;
        student.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        await student.save();

        // Email options
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: student.email,
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
    const {studentId, otp} = req.body;

    if(!studentId || !otp){
        return res.json({success:false, message: 'Missing Details'});
    }
    
    try {
        const student = await userModel.findById(studentId);

        if(!student){
            return res.json({success:false, message: 'User not Found'});
        }

        if(student.verifyOtp === '' || student.verifyOtp !== otp){
            return res.json({success:false, message: 'Invalid OTP'});
        }

        if(student.verifyOtpExpireAt < Date.now()){
            return res.json({success:false, message: 'OTP Expired'});
        }

        student.isAccountVerified = true;
        student.verifyOtp = '';
        student.verifyOtpExpireAt = 0;

        await student.save();

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
        
        const student = await userModel.findOne({email});
        if(!student){
            return res.json({success: false, message: "Student not found"})
        }

        if(!student.isAccountVerified){
            return res.json({success: false, message: "Account is not Verified"})
        }

        // Generate a 6-digit OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000)); 

        // Save OTP and expiration time
        student.resetOtp = otp;
        student.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        await student.save();

        // Email options
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: student.email,
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

// Reser Student Password
const studentResetPass = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Email, OTP, and new password are required" });
    }

    try {
        const student = await userModel.findOne({ email });
        if (!student) {
            return res.json({ success: false, message: "Student not found" });
        }

        if (student.resetOtp === "" || student.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (student.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 8);

        student.password = hashedPassword;
        student.resetOtp = '';
        student.resetOtpExpireAt = 0;

        await student.save();

        return res.json({ success: true, message: "Password has been reset successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


module.exports = {
    studentRegister,
    studentLogin,
    logout,
    sendVerifyOtp,
    verifyEmail,
    isAuthenticated,
    studentResetPass,
    sendResetOtp,
  };