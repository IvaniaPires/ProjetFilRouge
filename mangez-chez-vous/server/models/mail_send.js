const transporter = require('../../config/mail');

exports.send_mail = (subjet, mail, confirmation_code) =>{
    transporter.sendMail({
        from: 'mcv.repas@gmail.com',
        to: mail,
        subject: subjet,
        html: `<h1>Email Confirmation</h1>
        <h2>Hello</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:8080/confirm/${confirmation_code}> Click here</a>
        </div>`,
    }).catch(err => console.log(err));
        
    
};