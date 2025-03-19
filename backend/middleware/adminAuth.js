const jwt = require('jsonwebtoken');

const adminAuth = async (req, res, next)=>{
    const {token} = req.cookies;

    if(!token){
        return res.json({success: false, message: 'Not Authorized'})
    }

    try {
        
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded Token:", tokenDecode); // 🔍 Debug here
        
        if(tokenDecode.id){
            req.body.adminId = tokenDecode.id;
            req.body.userType = tokenDecode.userType;
        }else{
            return res.json({success: false, message: 'Not Authorized Login'})
        }

        next();


    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

module.exports = adminAuth;