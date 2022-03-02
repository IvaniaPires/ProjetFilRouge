const query = require('../models/db_query');
const regist_controller = require('./regist_controller');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.form_restaurant = async(req,res)=>{
    const  result = await query.perform_query("SELECT id_mcv_local, name_mcv_local from mcv_local", []);    
    res.render("form_restaurant.ejs", { stores: result });
};

exports.new_application = async(req, res)=>{
    const verif = regist_controller.form_verification(req);
    if(!verif){
        const {id_mcv_local, name_restaurant, name_owner, address_restaurant, phone, mail} = req.body;    
        const result = await query.perform_query("INSERT INTO restaurant_application (id_mcv_local, name_restaurant, name_owner, address_restaurant, phone_restaurant, mail_restaurant) VALUES (?,?,?,?,?,?)", [id_mcv_local, name_restaurant, name_owner, address_restaurant, phone, mail]);
            res.redirect('/confirmation.html')
    } else {
        res.render('error', {error: verif, return_path: "/new_restaurant_application", return_message:"Formulaire d'inscription"});
    } 
    
}

exports.activate = async (req,res) => {
    const parts = req.params.login.split('_'); 
    if(req.user_pseudo){        
        const result_activate = await query.perform_query("UPDATE restaurant SET activated_restaurant = 1 WHERE login_restaurant = ?", [req.user_pseudo]);    
        const del_application = await query.perform_query("DELETE FROM restaurant_application WHERE id_restaurant_application = ?", [parts[0]])
        res.redirect('/login.html');    
    } else {
        if(req.error === 1){
            res.render('error', {error: "Vous n'êtes pas inscrit ", return_path: "/form_restaurant", return_message:"Formulaire pour devenir restaurant partenaire"})
        } else {                                  
            const untreated= await query.perform_query("UPDATE restaurant_application SET created_restaurant = ? WHERE id_restaurant_application = ?", [0 ,parts[0]]);      
            res.render('error', {error: "Votre inscription a expiré! Veuillez recontacter le magasin", return_path: "", return_message:""})                    
        }
    }
}

exports.login = async(req,res) => {
    const {login_user, password_user} = req.body;
    const result = await query.perform_query("SELECT * FROM restaurant WHERE login_restaurant = ? LIMIT 1", [login_user]);    
    if(result.length ===0 || !bcrypt.compareSync(password_user, result[0].password_restaurant)){
        res.render('error', {error: "Login ou mot de passe incorects", return_path: "/login.html", return_message:"Se connecter"})
    } else {        
        if(result[0].activated_restaurant === 1){            
        const connected = await query.perform_query("UPDATE restaurant SET connected_restaurant = ? WHERE id_restaurant = ?", [1, result[0].id_restaurant]);
        const token = jwt.sign({ user_pseudo: login_user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "4h"});
        res.cookie("x-access-token", token, {
            secure: true,
            httpOnly: true
        });
        res.render('restaurant_acount', {restaurant: result});
        } else {
            res.render('error', {error:"Votre inscription n'est pas activé. Veuillez véréfier votre email!",return_path: "", return_message:""});
        }       

    }
}

exports.logout = async (req,res) => {
    
}