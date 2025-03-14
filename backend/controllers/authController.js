const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const studentRegister = async (req, res) =>{

    const {student_id, name, email, password} = req.body;

    if(!name || !email || !password){
        return res.json({success: false, message: 'Missing Details!'})
    }

    try {

        const existingStudent = await userModel.findOne({email})

        if(existingStudent){
            return res.json({success: false, message: 'User already exist!'})
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const student = new userModel({student_id, name, email, password: hashedPassword});
        await student.save();

        const token = jwt.sign({id: userModel._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        // Sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to SmartCanteen',
            text: ``
        }

        return res.json({success: true, message: 'login successfully'});


    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}


const studentLogin = async (req, res) =>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.json({success: false, message: 'Email and password are required!'})
    }

    try {

        const student = await userModel.findOne({email});

        if(!student){
            return res.json({success: false, message: 'Invalid email'})
        }
        
        const isMatch = await bcrypt.compare(password, student.password);

        if(!isMatch){
            return res.json({success: false, message: 'Email and password are required!'})
        }
        const token = jwt.sign({id: userModel._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7days
        });

        return res.json({success: true, message: 'login successfully'});


        
    } catch (error) {
        return res.json({success: false, message: 'Email and password are required!'})
    }

}

const logout = async = (req, res) =>{
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



module.exports = {
    studentRegister,
    studentLogin,
    logout,
  };