const jwt = require("jsonwebtoken");
require('dotenv').config();


exports.verify_token = (req,res,next)=>{
    const token =  req.headers["x-access-token"] || req.params.code || req.cookies['x-access-token'];    
    if (!token) {        
        console.log(req.error)        
    } else {
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);        
            req.user_pseudo = decoded.user_pseudo;        
        } catch (err) {
            req.error = 2;                  
        }
    }    
    return next();
}

