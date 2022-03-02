const query= require('../models/db_query');
const regist_controller = require('./regist_controller');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mail_send = require('../models/mail_send');

exports.register = async (req, res) =>{
    const verif = regist_controller.form_verification(req);
    if(!verif){
        const {last_name_costumer, first_name_costumer, phone, mail, address_costumer, login_costumer, password} = req.body;
        const result_login = await query.perform_query("SELECT login_costumer FROM costumer WHERE login_costumer = (?) LIMIT 1", [login_costumer]);
        if(result_login.length!==0){            
            res.render('error', {error:"Ce login est déjà pris.",return_path: "/new_costumer.html", return_message:"Formulaire d'inscription"});
        } else {
            const password_costumer = bcrypt.hashSync(password, 10);
            const result = await query.perform_query("INSERT INTO costumer(lastname_costumer, firstname_costumer, phone_costumer, mail_costumer, address_costumer, login_costumer, password_costumer) VALUES (?,?,?,?,?,?,?)", [last_name_costumer, first_name_costumer, phone, mail, address_costumer, login_costumer, password_costumer]);
            if(result){
                const token = jwt.sign({ user_pseudo: login_costumer}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1d"});
                mail_send.send_mail("Mangez-Chez-Vous: Confirmation d'inscription", mail, token, login_costumer, 1);
                res.redirect('/confirmation.html');
            } else {
                res.render('error', {error:"Une erreur est survenue lors de l'envoye du formoulaire. Veuillez recommencer.",return_path: "/new_costumer.html", return_message:"Formulaire d'inscription"});
            }    
        }       
    } else {
        res.render('error', {error: verif, return_path: "/new_costumer.html", return_message:"Formulaire d'inscription"});
    }
}


exports.activate = async (req,res)=> {     
    if(req.user_pseudo){        
        const result_activate = await query.perform_query("UPDATE costumer SET activated_costumer = 1 WHERE login_costumer = (?)", [req.user_pseudo]);    
        res.redirect('/login.html');    
    } else {
        if(req.error === 1){
            res.render('error', {error: "Vous n'êtes pas inscrit ", return_path: "/new_costumer.html", return_message:"Formulaire d'inscription"})
        } else {                       
            const del_register = await query.perform_query("DELETE FROM costumer WHERE login_costumer = (?)", [req.params.login]);       
            res.render('error', {error: "Votre inscription a expiré!  ", return_path: "/new_costumer.html", return_message:"Formulaires d'inscription"})                    
        }
    }
};

exports.login = async (req,res) => {
    const {login_user, password_user} = req.body;
    const result = await query.perform_query("SELECT login_costumer, firstname_costumer, lastname_costumer, activated_costumer, password_costumer FROM costumer WHERE login_costumer = ? LIMIT 1", [login_user]);
    if(!result || !bcrypt.compareSync(password_user, result[0].password_costumer)){
        res.render('error', {error: "Login ou mot de passe incorects", return_path: "/login.html", return_message:"Se connecter"})
    } else {
        if(result.activated_costumer === 1){            
        const connected = await query.perform_query("UPDATE costumer SET connected_costumer = 1 WHERE login_costumer = (?)", [login_user]);
            const token = jwt.sign({ user_pseudo: login_costumer}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "4h"});
            res.header('x-access-token', token)
            res.render('home_costumer', {user: result})
        } else {
            res.render('error', {error:"Votre inscription n'est pas activé. Veuillez véréfier votre email!",return_path: "", return_message:""});
        }       

    }
}