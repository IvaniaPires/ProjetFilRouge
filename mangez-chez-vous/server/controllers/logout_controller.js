const costumer_controller = require('./costumer_controller');
const delivery_man_controller = require('./delivery_man_controller');
const restaurant_controller = require('./regist_controller');
const store_controller = require('./store_controller');

exports.logout = (req,res) => {
    const user_type = req.body.user_type;    
    switch (user_type) {
        case 'costumer':
            costumer_controller.logout(req,res);
            break;
        case 'delivery_man':
            delivery_man_controller.logout(req,res);
            break;
        case 'restaurant':
            restaurant_controller.logout(req,res);
            break;
        default:
            store_controller.logout(req,res);
            
    }
};