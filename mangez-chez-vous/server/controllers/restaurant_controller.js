const query = require('../models/db_query');
const regist_controller = require('./regist_controller');

exports.form_restaurant = async(req,res)=>{
    const  result = await query.perform_query("SELECT id_mcv_local, name_mcv_local from mcv_local", []);    
    res.render("form_restaurant.ejs", { stores: result });
};

exports.new_application = async(req, res)=>{
    const verif = regist_controller.form_verification(req);
    if(!verif){
        const {id_mcv_local, name_restaurant, name_owner, address_restaurant, phone, mail} = req.body;    
        const result = await query.perform_query("INSERT INTO restaurant_application (id_mcv_local, name_restaurant, name_owner, address_restaurant, phone_restaurant, mail_restaurant) VALUES (?,?,?,?,?,?)", [id_mcv_local, name_restaurant, name_owner, address_restaurant, phone, mail]);
        if(result){
            res.redirect('/confirmation.html')
        } else {
            res.render('error', {error:"Une erreur est survenue lors de l'envoye du formoulaire. Veuillez recommencer.",return_path: "/new_restaurant_application", return_message:"Formulaire d'inscription"});
        }    
    } else {
        res.render('error', {error: verif, return_path: "/new_restaurant_application", return_message:"Formulaire d'inscription"});
    } 
    
}