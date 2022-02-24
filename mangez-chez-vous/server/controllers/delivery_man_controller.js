const query = require('../models/db_query');
const regist_controller = require('./regist_controller');

exports.form_delivery_man = async(req,res)=>{
    const  result = await query.perform_query("SELECT id_mcv_local, name_mcv_local from mcv_local", []);    
    res.render("form_delivery_man.ejs", { stores: result });
};

exports.new_application = async(req, res)=>{  
    const verif = regist_controller.form_verification(req);
    if(!verif){
        const {id_mcv_local, last_name_delivery_man, first_name_delivery_man, phone, mail} = req.body;        
        const result = await query.perform_query("INSERT INTO delivery_man_application (id_mcv_local, lastname_delivery_man, firstname_delivery_man, phone_delivery_man, mail_delivery_man) VALUES (?,?,?,?,?)", [id_mcv_local, last_name_delivery_man, first_name_delivery_man, phone, mail]);
        if(result){
            res.redirect('/confirmation.html')
        } else {
            res.redirect('/error/3');
        }
    } else {
        res.render('error_form', {error: verif})
    }    
}