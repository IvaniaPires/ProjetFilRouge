const jwt = require('jsonwebtoken');
const jwt_auth = require('../../middleware/jwt_auth')

exports.activate = (req,res)=>{
    const token = jwt_auth.verifyToken(req);
     
}