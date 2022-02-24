const express = require('express');
const router = express.Router();
const restaurant_controller = require('../controllers/restaurant_controller');
const error_controller = require('../controllers/error_controller');
const delivery_man_controller = require('../controllers/delivery_man_controller');
const costumer_controller = require('../controllers/costumer_controller');
const conf_register_controller = require('../controllers/conf_register_controller');
//App Routes 

router.get('/',(req, res) => {    
    const dir = __dirname.split('server');    
    res.sendFile(dir[0] + '/public/home.html')
});
//general
router.get('/error/:id', error_controller.error);

//restaurant
router.get('/new_restaurant_application',restaurant_controller.form_restaurant);
router.post('/form_restaurant',restaurant_controller.new_application);

//delivery_man
router.get('/new_delivery_man_application', delivery_man_controller.form_delivery_man);
router.post('/form_delivery_man', delivery_man_controller.new_application);

//costumer
router.post('/add_costumer', costumer_controller.register);


//conf acount
router.get('/confirm/:code',conf_register_controller.activate);
module.exports = router;

