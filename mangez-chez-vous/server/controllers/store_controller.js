const query= require('../models/db_query');
const regist_controller = require('./regist_controller');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mail_send = require('../models/mail_send');
const generate_pass = require('../models/generate_pass');

exports.login = async (req,res) => {
    const {login_user, password_user} = req.body;
    const result = await query.perform_query("SELECT * FROM mcv_local WHERE login_mcv_local = ? LIMIT 1", [login_user]);
    if(!result || !bcrypt.compareSync(password_user, result[0].password_mcv_local)){
        res.render('error', {error: "Login ou mot de passe incorects", return_path: "/login.html", return_message:"Se connecter"})
    } else { 
        const connected = await query.perform_query("UPDATE mcv_local SET connected_mcv_local = ? WHERE login_mcv_local = (?)", [1, login_user]);
        const token = jwt.sign({ user_pseudo: login_user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "4h"});
        res.cookie("x-access-token", token, {
            secure: true,
            httpOnly: true,
            maxAge: 4*60*60*1000
        });
        res.render('store_acount', {store: result})    
    }
}

exports.restaurant_to_add = async(req,res) =>{
    const id = req.params.id;
    const store = await query.perform_query("SELECT img_mcv_local, id_mcv_local, connected_mcv_local FROM mcv_local WHERE id_mcv_local = ?", [id]);   
    if(store[0].connected_mcv_local === 1 && req.user_pseudo){        
        const result = await query.perform_query("SELECT restaurant_application.*, mcv_local.img_mcv_local FROM restaurant_application INNER JOIN mcv_local ON restaurant_application.id_mcv_local = mcv_local.id_mcv_local WHERE restaurant_application.id_mcv_local = ? AND restaurant_application.created_restaurant = ? ", [id, 0]);        
        if (result.length !==0){
            res.render('restaurant_applications', {restaurants : result})
        }else {            
            res.render('restaurant_applications', {restaurants : store})
        }
    } else {
        if(result[0].connected_mcv_local === 1){
            const connected = await query.perform_query("UPDATE mcv_local SET connected_mcv_local = ? WHERE id_mcv_local = (?)", [0, id]);
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
            const connected = await query.perform_query("UPDATE mcv_local SET connected_mcv_local = 0 WHERE id_mcv_local = (?)", [req.params.id]);
        }
        res.render('error', {error: "Vous devez vous connecter pour accèder à cette page.", return_path: "/login.html", return_message:"Se connecter"})
    }
}

exports.add_restaurant = async (req,res) => {
    const id = req.params.id_store;
    const connected = await query.perform_query("SELECT connected_mcv_local FROM mcv_local WHERE id_mcv_local = ? LIMIT 1", [id]);
    if(connected[0].connected_mcv_local === 1 && req.user_pseudo){
        const password_restaurant = generate_pass.random_pass();        
        const hash_password_restaurant = bcrypt.hashSync(password_restaurant, 10);
        const result = await query.perform_query("SELECT * FROM restaurant_application WHERE id_restaurant_application = ? LIMIT 1", [req.params.id]);
        const login_restaurant = req.params.id + "_" + result[0].name_restaurant ;
        const new_restaurant = await query.perform_query("INSERT INTO restaurant (id_mcv_local, name_restaurant, address_restaurant,            phone_restaurant, mail_restaurant, login_restaurant, password_restaurant) VALUES (?,?,?,?,?,?,?)", [id, result[0].name_restaurant, result[0].address_restaurant, result[0].phone_restaurant, result[0].mail_restaurant, login_restaurant, hash_password_restaurant]);
        const treated = await query.perform_query("UPDATE restaurant_application SET created_restaurant = ? WHERE id_restaurant_application =?", [1,req.params.id]);
        const token = jwt.sign({ user_pseudo: login_restaurant}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "7d"});
                mail_send.send_mail(`Mangez-Chez-Vous: Confirmation d'inscription. /n ☛Login:  ${login_restaurant} ☛Mot de passe: ${password_restaurant}`, result[0].mail_restaurant, token, login_restaurant, 2);
                res.redirect(`/add_restaurant/${id}`);
    } else {
        if(result[0].connected_mcv_local === 1){
            const connected = await query.perform_query("UPDATE mcv_local SET connected_mcv_local = 0 WHERE id_mcv_local = (?)", [id]);
        }
        res.render('error', {error: "Vous devez vous connecter pour accèder à cette page.", return_path: "/login.html", return_message:"Se connecter"})
    }
}

exports.logout = async (req,res) => {
    const logout = query.perform_query("UPDATE mcv_local SET connected_mcv_local = ? WHERE id_mcv_local = ?", [0, req.params.id]);
    res.redirect('/home.html');
}

exports.delivery_man_to_add = async (req,res) => {
    const id = req.params.id;
    const store = await query.perform_query("SELECT img_mcv_local, id_mcv_local, connected_mcv_local FROM mcv_local WHERE id_mcv_local = ?", [id]);   
    if(store[0].connected_mcv_local === 1 && req.user_pseudo){        
        const result = await query.perform_query("SELECT delivery_man_application.*, mcv_local.img_mcv_local FROM delivery_man_application INNER JOIN mcv_local ON delivery_man_application.id_mcv_local = mcv_local.id_mcv_local WHERE delivery_man_application.id_mcv_local = ? AND delivery_man_application.created_delivery_man = ? ", [id, 0]);        
        if (result.length !==0){
            res.render('delivery_man_applications', {delivery_mens : result})
        }else {            
            res.render('delivery_man_applications', {delivery_mens : store})
        }
    } else {
        if(result[0].connected_mcv_local === 1){
            const connected = await query.perform_query("UPDATE mcv_local SET connected_mcv_local = ? WHERE id_mcv_local = ?", [0, id]);
        }
        res.render('error', {error: "Vous devez vous connecter pour acceder à cette page.", return_path: "/login.html", return_message:"Se connecter"})
    }
}

exports.add_delivery_man = async (req,res) =>{
    const id = req.params.id_store;
    const connected = await query.perform_query("SELECT connected_mcv_local FROM mcv_local WHERE id_mcv_local = ? LIMIT 1", [id]);
    if(connected[0].connected_mcv_local === 1 && req.user_pseudo){
        const password_delivery_man = generate_pass.random_pass();        
        const hash_password_delivery_man = bcrypt.hashSync(password_delivery_man, 10);
        const result = await query.perform_query("SELECT * FROM delivery_man_application WHERE id_delivery_man_application = ? LIMIT 1", [req.params.id]);
        const login_delivery_man = req.params.id + "_" + result[0].lastname_delivery_man ;
        const new_delivery_man = await query.perform_query("INSERT INTO delivery_man (id_mcv_local, lastname_delivery_man, firstname_delivery_man,    phone_delivery_man, mail_delivery_man, login_delivery_man, password_delivery_man) VALUES (?,?,?,?,?,?,?)", [id, result[0].lastname_delivery_man, result[0].firstname_delivery_man, result[0].phone_delivery_man, result[0].mail_delivery_man, login_delivery_man, hash_password_delivery_man]);
        const treated = await query.perform_query("UPDATE delivery_man_application SET created_delivery_man = ? WHERE id_delivery_man_application =?", [1,req.params.id]);
        const token = jwt.sign({ user_pseudo: login_delivery_man}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "7d"});
                mail_send.send_mail(`Mangez-Chez-Vous: Confirmation d'inscription. /n ☛Login:  ${login_delivery_man} ☛Mot de passe: ${password_delivery_man}`, result[0].mail_delivery_man, token, login_delivery_man, 3);
                res.redirect(`/add_delivery_man/${id}`);
    } else {
        if(result[0].connected_mcv_local === 1){
            const connected = await query.perform_query("UPDATE mcv_local SET connected_mcv_local = 0 WHERE id_mcv_local = (?)", [id]);
        }
        res.render('error', {error: "Vous devez vous connecter pour accèder à cette page.", return_path: "/login.html", return_message:"Se connecter"})
    }
}

exports.add_location = async (req,res) =>{
    const connected = await query.perform_query("SELECT connected_mcv_local FROM mcv_local WHERE id_mcv_local = ? LIMIT 1", [req.params.id]);
    if(connected[0].connected_mcv_local === 1 && req.user_pseudo){
        res.render('form_location',  { id_mcv_local: req.params.id } );
    } else {
        res.render('error', {error: "Vous devez vous connecter pour accèder à cette page.", return_path: "/login.html", return_message:"Se connecter"});
    }
}

exports.new_location = async (req,res) => {
    const id = req.params.id;
    const connected = await query.perform_query("SELECT connected_mcv_local FROM mcv_local WHERE id_mcv_local = ? LIMIT 1", [id]);
    if(connected[0].connected_mcv_local === 1 && req.user_pseudo){
        const verif = regist_controller.form_verification(req);
        if(!verif){
            const {name_location, postal_code, departement, delivery_price} = req.body;
            console.log(name_location)
            const location = await query.perform_query("SELECT * FROM location WHERE id_mcv_local = ? AND name_location = ? AND postal_code =?", [id, name_location, postal_code]);
            if (location.length!==0){
                res.render('error', {error: "Vous avez déjà additionner cette localisation.", return_path: `/add_location/ ${id}` , return_message:"Additionner localisation"});
            } else {
                const new_location = await query.perform_query("INSERT INTO location (name_location, postal_code, departement, delivery_price, id_mcv_local) VALUES (?,?,?,?,?)", [name_location, postal_code, departement, delivery_price, id]);
                res.render('confirmation', {confmsg: "Localisation additionnée.", return_path: `/stores/ ${id}` , return_message:"Home"});
            }  
        } else {
            res.render('error', {error: verif, return_path:  `form_location/ ${id}`, return_message:"Additionner localisation"});
        }
    } else {
        res.render('error', {error: "Vous devez vous connecter pour accèder à cette page.", return_path: "/login.html", return_message:"Se connecter"});
    }
}

