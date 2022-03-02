const jwt = require("jsonwebtoken");
require('dotenv').config();


exports.verify_token = (req,res,next)=>{
    const token =  req.headers["x-access-token"] || req.params.code || req.cookies['x-access-token'];
    console.log(req.cookies['x-access-token'])
    if (!token) {
        req.error = 1;        
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        req.user_pseudo = decoded.user_pseudo;
        console.log(req.user_pseudo)
    } catch (err) {
        req.error = 2;        
    }
    return next();
}

