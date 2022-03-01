const jwt = require('jsonwebtoken');
const jwt_auth = require('../../middleware/jwt_auth');
const query = require("../models/db_query");

exports.activate = async (req,res)=> {
    const token = jwt_auth.verifyToken(req); 
    if(token[0]){
        const result_login = await query.perform_query("UPDATE costumer SET connected_costumer = 1 WHERE login_costumer = (?)", [token[1]]);
        if(result_login.affectedRows){
            res.redirect('/login.html');
        } else {
            res.render('error_controller', {error:"error"});
        }
            
        

    }
}