function isEmail(mailuser){
    let regEmail = new RegExp('^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
	return regEmail.test(mailuser);
};

function validatePass (pass){      
    return(pass.match( /[0-9]/g) && 
            pass.match( /[A-Z]/g) && 
            pass.match(/[a-z]/g) && 
            pass.match( /[^a-zA-Z\d]/g) &&
            pass.length >= 8)       
}

exports.form_verification = (req) => {
    try{
        Object.values(req.body).forEach( element=>{
            if(element.trim()==='') throw "Tous les champs doivent être remplis"
        });
        if(req.body.mail && !isEmail(req.body.mail)) throw "Adresse email invalide!";
        if(req.body.password && !validatePass(req.body.password)) throw "Mot de passe invalide!";
        if(req.body.phone && req.body.phone.length<10) throw "Numéro de téléphone invalide"
        if(req.body.password && (req.body.password!==req.body.conf_password)) throw "Le mot de passe et sa confirmation doivent être identiques";
    } catch(err){
        return(err);
    }
    
}

