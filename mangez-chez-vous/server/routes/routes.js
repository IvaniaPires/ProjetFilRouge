const express = require('express');
const router = express.Router();
const restaurant_controller = require('../controllers/restaurant_controller');
const login = require('../models/login')
const delivery_man_controller = require('../controllers/delivery_man_controller');
const costumer_controller = require('../controllers/costumer_controller');
const jwt_auth = require('../../middleware/autho_jwt');
const store_controller = require('../controllers/store_controller');
const logout = require('../models/logout');

//App Routes 

router.get('/',(req, res) => {    
    const dir = __dirname.split('server');    
    res.sendFile(dir[0] + '/public/home.html')
});


//store
router.get('/add_restaurant/:id', jwt_auth.verify_token, (req,res,next)=>{     
    store_controller.restaurant_to_add(req,res);
});
router.get('/stores/:id', jwt_auth.verify_token, (req,res,next)=> {
    store_controller.store_account(req,res);
});
router.get('/new_restaurant/:id/:id_store', jwt_auth.verify_token, (req,res,next)=> {
    store_controller.add_restaurant(req,res);
});
router.get('/add_delivery_man/:id', jwt_auth.verify_token, (req,res,next)=> {
    store_controller.delivery_man_to_add(req,res);
});
router.get('/new_delivery_man/:id/:id_store', jwt_auth.verify_token, (req,res,next)=> {
    store_controller.add_delivery_man(req,res);
});
router.get('/add_location/:id',  jwt_auth.verify_token, (req,res,next)=> {
    store_controller.add_location(req,res);
});
router.post('/new_location/:id', jwt_auth.verify_token, (req,res,next)=> {
    store_controller.new_location(req,res);
});

//restaurant
router.get('/new_restaurant_application',restaurant_controller.form_restaurant);
router.post('/form_restaurant',restaurant_controller.new_application);
router.get('/update_restaurant/:id', jwt_auth.verify_token, (req,res,next)=> {
    restaurant_controller.update_restaurant(req,res);
});
router.get('/restaurants/:id', jwt_auth.verify_token, (req,res,next)=> {
    restaurant_controller.restaurant_account(req,res);
});
router.post('/update_restaurant/:id', jwt_auth.verify_token, (req,res,next)=> {
    restaurant_controller.change_restaurant(req,res);
});

//delivery_man
router.get('/new_delivery_man_application', delivery_man_controller.form_delivery_man);
router.post('/form_delivery_man', delivery_man_controller.new_application);


//costumer
router.post('/add_costumer', costumer_controller.register);
router.post('/search', costumer_controller.search_location);
router.get('/location/:id', costumer_controller.location_restaurants);

//conf acount
router.get('/confirm/:code/:login/:type',jwt_auth.verify_token, (req,res,next)=>{     
    if (req.params.type === '1'){        
        costumer_controller.activate(req,res);
    }
    if (req.params.type === '2'){        
        restaurant_controller.activate(req,res);
    }
    if (req.params.type === '3'){        
        delivery_man_controller.activate(req,res);
    }
});

//login
router.post('/login', login.login);

//logout
router.get('/logout/:type/:id', logout.logout);


module.exports = router;

