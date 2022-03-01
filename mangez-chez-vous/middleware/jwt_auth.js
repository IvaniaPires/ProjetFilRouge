
const jwt = require("jsonwebtoken");
require('dotenv').config();


exports.verifyToken = (req, res, next) => {
    //console.log( "params" + req.params.code);
    const token =  req.body.token || req.query.token || req.headers["x-access-token"] || req.params.code;
    //console.log("token" + token)
    
    if (!token) {
        return [false ,"A token is required for authentication"];
      }
      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);        
        req.user_pseudo = decoded.user_pseudo;
        //console.log("decoded" + decoded.user_pseudo)
      } catch (err) {
        return [false, "Invalid Token"];
      }
      return [true,req.user_pseudo];
     /* if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        console.log("err" + err)
      if (err) return false
      // se tudo estiver ok, salva no request para uso posterior
      console.log(decoded.user_pseudo)
      req.user_pseudo = decoded.user_pseudo;
      next();
    });*/
    };
    
    
