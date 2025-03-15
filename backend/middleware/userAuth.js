const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next)=>{
    const {token} = req.cookies;

    if(!token){
        return res.json({success: false, message: 'Not Authorized'})
    }

    try {
        
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        
        if(tokenDecode.id){
            req.body.studentId = tokenDecode.id
        }else{
            return res.json({success: false, message: 'Not Authorized Login'})
        }

        next();


    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

module.exports = userAuth;