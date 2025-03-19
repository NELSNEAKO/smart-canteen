const reservationModel = require("../models/reservationModel");
const adminModel = require("../models/adminModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer');

const getTotalReservations = async (req, res) => {
    try {
        // Get the current date from the latest reservation
        const latestReservation = await reservationModel.findOne().sort({ date: -1 });
        if (!latestReservation) {
            return res.json({ totalReservations: 0, dailyReservations: 0, weeklyReservations: 0, monthlyReservations: 0 });
        }

        const currentDate = latestReservation.date;
        const startOfDay = new Date(currentDate.setUTCHours(0, 0, 0, 0));
        const endOfDay = new Date(currentDate.setUTCHours(23, 59, 59, 999));
        const startOfWeek = new Date(currentDate);
        startOfWeek.setUTCDate(currentDate.getUTCDate() - currentDate.getUTCDay());
        startOfWeek.setUTCHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
        endOfWeek.setUTCHours(23, 59, 59, 999);
        const startOfMonth = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1);
        const endOfMonth = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 0);
        endOfMonth.setUTCHours(23, 59, 59, 999);

        const getReservationCount = async (start, end) => {
            return await reservationModel.countDocuments({ date: { $gte: start, $lte: end } });
        };

        const totalReservations = await reservationModel.countDocuments();
        const dailyReservations = await getReservationCount(startOfDay, endOfDay);
        const weeklyReservations = await getReservationCount(startOfWeek, endOfWeek);
        const monthlyReservations = await getReservationCount(startOfMonth, endOfMonth);

        res.json({
            success: true, data: {
            totalReservations,
            dailyReservations,
            weeklyReservations,
            monthlyReservations,
        }});
    } catch (error) {
        console.error("Error fetching reservation counts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

  

const getTotalAmounts = async (req, res) => {
    try {
        // Get the current date from the database
        const latestReservation = await reservationModel.findOne().sort({ date: -1 });
        if (!latestReservation) {
            return res.json({ dailyRevenue: 0, weeklyRevenue: 0, monthlyRevenue: 0 });
        }

        const currentDate = latestReservation.date;
        const startOfDay = new Date(currentDate.setUTCHours(0, 0, 0, 0));
        const endOfDay = new Date(currentDate.setUTCHours(23, 59, 59, 999));
        const startOfWeek = new Date(currentDate);
        startOfWeek.setUTCDate(currentDate.getUTCDate() - currentDate.getUTCDay());
        startOfWeek.setUTCHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
        endOfWeek.setUTCHours(23, 59, 59, 999);
        const startOfMonth = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1);
        const endOfMonth = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 0);
        endOfMonth.setUTCHours(23, 59, 59, 999);

        const getRevenue = async (start, end) => {
            const result = await reservationModel.aggregate([
                { $match: { date: { $gte: start, $lte: end } } },
                { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
            ]);
            return result.length > 0 ? result[0].totalRevenue : 0;
        };

        const dailyRevenue = await getRevenue(startOfDay, endOfDay);
        const weeklyRevenue = await getRevenue(startOfWeek, endOfWeek);
        const monthlyRevenue = await getRevenue(startOfMonth, endOfMonth);

        res.json({success: true, data: {
            dailyRevenue,
            weeklyRevenue,
            monthlyRevenue,
        }});
    } catch (error) {
        console.error("Error fetching revenue:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




const adminRegister = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing Details!" });
    }

    try {
        const existingAdmin = await adminModel.findOne({ email });

        if (existingAdmin) {
            return res.json({ success: false, message: "admin already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const admin = new adminModel({
            name,
            email,
            password: hashedPassword,
        });

        await admin.save();

        // ✅ Corrected token generation
        const token = jwt.sign(
            { id: admin._id, userType: "admin" },  // Include adminType
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            // secure: false,
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

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email and password are required!" });
    }

    try {
        const admin = await adminModel.findOne({ email });

        if (!admin) {
            return res.json({ success: false, message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        // ✅ Use admin._id instead of adminModel._id
        const token = jwt.sign(
            { id: admin._id, adminType: "admin" },  // Include adminType
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            // secure: false,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.json({ success: true, message: "Login successful", token, userType: 'admin' });

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
        const { adminId } = req.body;

        // Check if admin exists
        const admin = await adminModel.findById(adminId);
        if (!admin) {
            return res.json({ success: false, message: "admin not found" });
        }

        // Check if account is already verified
        if (admin.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified" });
        }

        // Generate a 6-digit OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000)); 

        // Save OTP and expiration time
        admin.verifyOtp = otp;
        admin.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        await admin.save();

        // Email options
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: admin.email,
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
    const {adminId, otp} = req.body;

    if(!adminId || !otp){
        return res.json({success:false, message: 'Missing Details'});
    }
    
    try {
        const admin = await adminModel.findById(adminId);

        if(!admin){
            return res.json({success:false, message: 'admin not Found'});
        }

        if(admin.verifyOtp === '' || admin.verifyOtp !== otp){
            return res.json({success:false, message: 'Invalid OTP'});
        }

        if(admin.verifyOtpExpireAt < Date.now()){
            return res.json({success:false, message: 'OTP Expired'});
        }

        admin.isAccountVerified = true;
        admin.verifyOtp = '';
        admin.verifyOtpExpireAt = 0;

        await admin.save();

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
        
        const admin = await adminModel.findOne({email});
        if(!admin){
            return res.json({success: false, message: "admin not found"})
        }

        if(!admin.isAccountVerified){
            return res.json({success: false, message: "Account is not Verified"})
        }

        // Generate a 6-digit OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000)); 

        // Save OTP and expiration time
        admin.resetOtp = otp;
        admin.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        await admin.save();

        // Email options
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: admin.email,
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

// Reser admin Password
const adminResetPass = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Email, OTP, and new password are required" });
    }

    try {
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.json({ success: false, message: "admin not found" });
        }

        if (admin.resetOtp === "" || admin.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (admin.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 8);

        admin.password = hashedPassword;
        admin.resetOtp = '';
        admin.resetOtpExpireAt = 0;

        await admin.save();

        return res.json({ success: true, message: "Password has been reset successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

const getAdminData = async (req,res) => {
    try {
      const {adminId} = req.body;
  
      const admin = await adminModel.findById(adminId);
  
      if(!admin){
        return res.json({success: false, message: 'admin not found'})
      }
  
      res.json({success: true,
        adminData: {
          name: admin.name,
          email: admin.email,
          password: admin.password,
          isAccountVerified: admin.isAccountVerified
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
      
    }
  }



module.exports = {
    logout,
    adminLogin,
    getAdminData,
    verifyEmail,
    adminRegister,
    sendResetOtp,
    sendVerifyOtp,
    adminResetPass,
    isAuthenticated,
    getTotalAmounts,
    getTotalReservations,
};
