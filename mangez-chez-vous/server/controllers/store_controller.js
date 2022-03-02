const query= require('../models/db_query');
const regist_controller = require('./regist_controller');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mail_send = require('../models/mail_send');

exports.login = async (req,res) => {
    const {login_user, password_user} = req.body;
    const result = await query.perform_query("SELECT * FROM mcv_local WHERE login_mcv_local = ? LIMIT 1", [login_user]);
    if(!result || !bcrypt.compareSync(password_user, result[0].password_mcv_local)){
        res.render('error', {error: "Login ou mot de passe incorects", return_path: "/login.html", return_message:"Se connecter"})
    } else { 
        const connected = await query.perform_query("UPDATE mcv_local SET connected_mcv_local = 1 WHERE login_mcv_local = (?)", [login_user]);
        const token = jwt.sign({ user_pseudo: login_user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "4h"});
        res.cookie("x-access-token", token, {
            secure: true,
            httpOnly: true
        });
        res.render('store_acount', {store: result})    
    }
}

exports.add_restaurant = async(req,res) =>{
    const id = req.params.id;
    const store = await query.perform_query("SELECT img_mcv_local, id_mcv_local, connected_mcv_local FROM mcv_local WHERE id_mcv_local = ?", [id]);   
    if(store[0].connected_mcv_local === 1 && req.user_pseudo){        
        const result = await query.perform_query("SELECT restaurant_application.*, mcv_local.img_mcv_local FROM restaurant_application INNER JOIN mcv_local ON restaurant_application.id_mcv_local = mcv_local.id_mcv_local WHERE restaurant_application.id_mcv_local = ?", [id]);        
        if (result.length !==0){
            res.render('restaurant_applications', {restaurants : result})
        }else {            
            res.render('restaurant_applications', {restaurants : store})
        }
    } else {
        if(result[0].connected_mcv_local === 1){
            const connected = await query.perform_query("UPDATE mcv_local SET connected_mcv_local = 0 WHERE id_mcv_local = (?)", [id]);
        }
        res.render('error', {error: "Vous devez vous connecter pour accèder à cette page.", return_path: "/login.html", return_message:"Se connecter"})
    }
}

exports.store_account = async (req,res) =>{    
    const result = await query.perform_query("SELECT * FROM mcv_local WHERE id_mcv_local = ? LIMIT 1", [req.params.id]);
    if(result[0].connected_mcv_local === 1 && req.user_pseudo){
        res.render('store_acount', {store: result});
    } else {
        if(result[0].connected_mcv_local === 1){
            const connected = await query.perform_query("UPDATE mcv_local SET connected_mcv_local = 0 WHERE id_mcv_local = (?)", [id]);
        }
        res.render('error', {error: "Vous devez vous connecter pour accèder à cette page.", return_path: "/login.html", return_message:"Se connecter"})
    }
}