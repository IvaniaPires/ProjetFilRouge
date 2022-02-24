const transporter = require('../../config/mail');

exports.send_mail = (subjet, mail, confirmation_code) =>{
    transporter.sendMail({
        from: 'mcv.repas@gmail.com',
        to: mail,
        subject: subjet,
        html: `<h1>Email de confirmation</h1>        
        <p>Confirmez votre inscription en cliquant sur le lien suivant</p>
        <a href=http://localhost:8080/confirm/${confirmation_code}> Cliquez ici</a>
        </div>`,
    }).catch(err => console.log(err));
        
    
};