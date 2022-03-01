const query= require('../models/db_query');
const regist_controller = require('./regist_controller');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt_auth = require('../../middleware/jwt_auth');
const mail_send = require('../models/mail_send');

exports.register = async (req, res) =>{
    const verif = regist_controller.form_verification(req);
    if(!verif){
        const {last_name_costumer, first_name_costumer, phone, mail, address_costumer, login_costumer, password} = req.body;
        const result_login = await query.perform_query("SELECT login_costumer FROM costumer WHERE login_costumer = (?) LIMIT 1", [login_costumer]);
        if(result_login.length!==0){            
            res.redirect('/error/2');
        } else {
            const password_costumer = bcrypt.hashSync(password, 10);
            const result = await query.perform_query("INSERT INTO costumer(lastname_costumer, firstname_costumer, phone_costumer, mail_costumer, address_costumer, login_costumer, password_costumer) VALUES (?,?,?,?,?,?,?)", [last_name_costumer, first_name_costumer, phone, mail, address_costumer, login_costumer, password_costumer]);
            if(result){
                const token = jwt.sign({ user_pseudo: login_costumer}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "2h"});
                mail_send.send_mail("Mangez-Chez-Vous: Confirmation d'inscription", mail, token);
                res.redirect('/confirmation.html');
            } else {
                res.redirect('/error/3');
            }    
        }       
    } else {
        res.render('error_form', {error: verif}) 
    }
}

exports.activate = async (req,res)=> {
    const token = jwt_auth.verifyToken(req); 
    if(token[0]){
        const result_login = await query.perform_query("UPDATE costumer SET connected_costumer = 1 WHERE login_costumer = (?)", [token[1]]);
        if(result_login.affectedRows){
            res.redirect('/login.html');
        } else {
            res.render('error', {error:"Une erreur est survenue. Veuillez recommencer.",return_path: "", return_message:""});
        }
    } else {
        
        res.render('error', {error: token[1], return_path: "/new_costumer.html", return_message:"Formulaire d'enregistrement"})
    }
}