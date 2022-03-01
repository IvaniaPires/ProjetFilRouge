const express = require('express');
const router = express.Router();
const restaurant_controller = require('../controllers/restaurant_controller');

const delivery_man_controller = require('../controllers/delivery_man_controller');
const costumer_controller = require('../controllers/costumer_controller');
const jwt = require('jsonwebtoken');
const jwt_auth = require('../../middleware/autho_jwt');
//App Routes 

router.get('/',(req, res) => {    
    const dir = __dirname.split('server');    
    res.sendFile(dir[0] + '/public/home.html')
});
//general


//restaurant
router.get('/new_restaurant_application',restaurant_controller.form_restaurant);
router.post('/form_restaurant',restaurant_controller.new_application);

//delivery_man
router.get('/new_delivery_man_application', delivery_man_controller.form_delivery_man);
router.post('/form_delivery_man', delivery_man_controller.new_application);

//costumer
router.post('/add_costumer', costumer_controller.register);


//conf acount

router.get('/confirm/:code/:login/:type',jwt_auth.verify_token, (req,res,next)=>{    
    
    if (req.params.type === '1'){        
        costumer_controller.activate(req,res);
    }
});
module.exports = router;

