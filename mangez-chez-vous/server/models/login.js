const costumer_controller = require('../controllers/costumer_controller');
const delivery_man_controller = require('../controllers/delivery_man_controller');
const restaurant_controller = require('../controllers/restaurant_controller');
const store_controller = require('../controllers/store_controller');

exports.login = (req,res) => {
    const user_type = req.body.user_type;    
    switch (user_type) {
        case 'costumer':
            costumer_controller.login(req,res);
            break;
        case 'delivery_man':
            delivery_man_controller.login(req,res);
            break;
        case 'restaurant':
            restaurant_controller.login(req,res);
            break;
        default:
            store_controller.login(req,res);
            
    }
};