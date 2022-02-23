const query = require('../models/db_query');

exports.form_restaurant = async(req,res)=>{
    const  result = await query.perform_query("SELECT id_mcv_local, name_mcv_local from mcv_local", []);    
    res.render("form_restaurant.ejs", { stores: result });
};

exports.new_application = async(req, res)=>{  
    const {id_mcv_local, name_restaurant, name_owner, address_restaurant, phone_restaurant, mail_restaurant} = req.body;    
    const result = await query.perform_query("INSERT INTO restaurant_application (id_mcv_local, name_restaurant, name_owner, address_restaurant, phone_restaurant, mail_restaurant) VALUES (?,?,?,?,?,?)", [id_mcv_local, name_restaurant, name_owner, address_restaurant, phone_restaurant, mail_restaurant]);
    if(result){
        res.redirect('/confirmation.html')
    } else {
        res.redirect('/error/3');
    }    
}