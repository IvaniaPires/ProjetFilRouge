exports.error = (req, res) => {
    let error, return_path, return_message;
    switch (parseInt(req.params.id)) {
        case 1:
            error = "Login ou mot de passe incorects";
            return_path = "/login.html";
            return_message = "Retour au formulaire ";
            break;
        case 2:
            error = "Ce login est déjà pris..";
            return_path = "../new_costumer.html";
            return_message = "Retour au formulaire ";
            break;
        case 3:
            error = "Une erreur est survenue lors de l'envoye du formoulaire. Veuillez recommencer.";
            return_path = "";
            return_message = "";
            break;
        default:
            error = "Vous devez vous connecter pour accèder à cette page.";
            return_path = "/";
            return_message = "Retour à l'accueil";
    }
    res.render('error.ejs', { error: error, return_path, return_message });
};