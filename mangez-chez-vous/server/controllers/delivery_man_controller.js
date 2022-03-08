const query = require('../models/db_query');
const regist_controller = require('./regist_controller');

exports.form_delivery_man = async(req,res)=>{
    const  result = await query.perform_query("SELECT id_mcv_local, name_mcv_local from mcv_local", []);    
    res.render("form_delivery_man.ejs", { stores: result });
};

exports.new_application = async(req, res)=>{  
    const verif = regist_controller.form_verification(req);
    if(!verif){
        const id_mcv_local = req.body.store;
        const {last_name_delivery_man, first_name_delivery_man, phone, mail} = req.body;        
        const result = await query.perform_query("INSERT INTO delivery_man_application (id_mcv_local, lastname_delivery_man, firstname_delivery_man, phone_delivery_man, mail_delivery_man) VALUES (?,?,?,?,?)", [id_mcv_local, last_name_delivery_man, first_name_delivery_man, phone, mail]);
        res.render('confirmation', {confmsg: "Votre candidature a été envoyée ", return_path: "", return_message:""});
    } else {
        res.render('error', {error: verif, return_path: "/new_delivery_man_application", return_message:"Formulaire d'inscription"});
    }    
}

exports.login = async(req,res) => {

}

exports.logout = async (req,res) => {
    
}

exports.activate = async (req,res) =>{
    const parts = req.params.login.split('_'); 
    if(req.user_pseudo){        
        const result_activate = await query.perform_query("UPDATE delivery_man SET activated_delivery_man = 1 WHERE login_delivery_man = ?", [req.user_pseudo]);    
        const del_application = await query.perform_query("DELETE FROM delivery_man_application WHERE id_delivery_man_application = ?", [parts[0]])
        res.redirect('/login.html');    
    } else {
        if(req.error === 1){
            res.render('error', {error: "Vous n'êtes pas inscrit ", return_path: "/form_delivery_man", return_message:"Formulaire pour devenir livreur"})
        } else {                                  
            const untreated= await query.perform_query("UPDATE delivery_man_application SET created_delivery_man = ? WHERE id_delivery_man_application = ?", [0 ,parts[0]]);
            const delete_created = await query.perform_query("DELETE from delivery_man WHERE login_delivery_man = ?", [req.params.login]);      
            res.render('error', {error: "Votre inscription a expiré! Veuillez recontacter le magasin", return_path: "", return_message:""})                    
        }
    }
}