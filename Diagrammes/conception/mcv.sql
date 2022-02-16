DROP TABLE IF EXISTS avoir;

DROP TABLE IF EXISTS realiser;

DROP TABLE IF EXISTS inclure;

DROP TABLE IF EXISTS constituer;

DROP TABLE IF EXISTS orders;

DROP TABLE IF EXISTS product;

DROP TABLE IF EXISTS delivery_man;

DROP TABLE IF EXISTS location;

DROP TABLE IF EXISTS restaurant;

DROP TABLE IF EXISTS delivery_man_application;

DROP TABLE IF EXISTS reply_mail;

DROP TABLE IF EXISTS restaurant_application;

DROP TABLE IF EXISTS costumer;

DROP TABLE IF EXISTS mcv_local;

DROP TABLE IF EXISTS product_type;

CREATE TABLE product_type (
    id_product_type int NOT NULL AUTO_INCREMENT,
    name_product_type varchar(30) NOT NULL,
    PRIMARY KEY (id_product_type)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE mcv_local (
    id_mcv_local int NOT NULL AUTO_INCREMENT,
    name_mcv_local varchar(30) NOT NULL,
    phone_mcv_local varchar(30) NOT NULL,
    mail_mcv_local varchar (50) NOT NULL,
    login_mcv_local varchar(30) NOT NULL,
    password_mcv_local varchar(250) NOT NULL,
    connected_mcv_local tinyint(1) DEFAULT 0,
    img_mcv_local varchar(50) NOT NULL,
    PRIMARY KEY (id_mcv_local)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE costumer (
    id_costumer int NOT NULL AUTO_INCREMENT,
    lastname_costumer varchar (30) NOT NULL,
    firstname_costumer varchar (30) NOT NULL,
    login_costumer varchar (30) NOT NULL,
    password_costumer varchar (250) NOT NULL,
    phone_costumer varchar (30) NOT NULL,
    mail_costumer varchar (50) NOT NULL,
    address_costumer varchar (100) DEFAULT NULL,
    connected_costumer tinyint (1) DEFAULT 0,
    fidelity_points_costumer int (5) DEFAULT 0,
    PRIMARY KEY (id_costumer)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE restaurant_application (
    id_restaurant_application int NOT NULL AUTO_INCREMENT,
    name_restaurant varchar(30) NOT NULL,
    address_restaurant varchar(100) NOT NULL,
    name_owner varchar(80) NOT NULL,
    phone_restaurant varchar(30) NOT NULL,
    mail_restaurant varchar(50) NOT NULL,
    id_mcv_local int NOT NULL,
    PRIMARY KEY (id_restaurant_application),
    CONSTRAINT restaurant_application_ibfk_1 FOREIGN KEY (id_mcv_local) REFERENCES mcv_local (id_mcv_local)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE reply_mail (
    id_reply_mail int NOT NULL AUTO_INCREMENT,
    mail_content text NOT NULL,
    send_mail varchar(50) NOT NULL,
    id_mcv_local int NOT NULL,
    PRIMARY KEY (id_reply_mail),
    CONSTRAINT reply_mail_ibfk_1 FOREIGN KEY (id_mcv_local) REFERENCES mcv_local (id_mcv_local)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE delivery_man_application(
    id_delivery_man_application int NOT NULL AUTO_INCREMENT,
    lastname_delivery_man varchar (30) NOT NULL,
    firstname_delivery_man varchar (30) NOT NULL,
    phone_delivery_man varchar (30) NOT NULL,
    mail_delivery_man varchar (50) NOT NULL,
    id_mcv_local int NOT NULL,
    PRIMARY KEY (id_delivery_man_application),
    CONSTRAINT delivery_man_application_ibfk_1 FOREIGN KEY (id_mcv_local) REFERENCES mcv_local (id_mcv_local)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE restaurant (
    id_restaurant int NOT NULL AUTO_INCREMENT,
    name_restaurant varchar(30) NOT NULL,
    address_restaurant varchar(100) NOT NULL,
    login_restaurant varchar(30) NOT NULL,
    password_restaurant varchar(250) NOT NULL,
    phone_restaurant varchar(30) NOT NULL,
    phone2_restaurant varchar(30) DEFAULT NULL,
    mail_restaurant varchar(50) NOT NULL,
    connected_restaurant tinyint(1) DEFAULT 0,
    open_restaurant tinyint (1) DEFAULT 0,
    img_restaurant varchar (50) DEFAULT 'restaurant.png',
    id_mcv_local int NOT NULL,
    PRIMARY KEY (id_restaurant),
    CONSTRAINT restaurant_ibfk_1 FOREIGN KEY (id_mcv_local) REFERENCES mcv_local (id_mcv_local)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE location (
    id_location int NOT NULL AUTO_INCREMENT,
    name_location varchar(30) NOT NULL,
    postal_code int(5) NOT NULL,
    departement varchar(30) NOT NULL,
    delivery_price float (5) NOT NULL,
    id_mcv_local int NOT NULL,
    PRIMARY KEY (id_location),
    CONSTRAINT location_ibfk_1 FOREIGN KEY (id_mcv_local) REFERENCES mcv_local (id_mcv_local)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE delivery_man (
    id_delivery_man int NOT NULL AUTO_INCREMENT,
    lastname_delivery_man varchar (30) NOT NULL,
    firstname_delivery_man varchar (30) NOT NULL,
    login_delivery_man varchar (30) NOT NULL,
    password_delivery_man varchar (250) NOT NULL,
    phone_delivery_man varchar (30) NOT NULL,
    mail_delivery_man varchar (50) NOT NULL,
    connected_delivery_man tinyint(1) DEFAULT 0,
    state_delivery_man tinyint (1) DEFAULT 0,
    id_mcv_local int NOT NULL,
    PRIMARY KEY (id_delivery_man),
    CONSTRAINT delivery_man_ibfk_1 FOREIGN KEY (id_mcv_local) REFERENCES mcv_local (id_mcv_local)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE product (
    id_product int NOT NULL AUTO_INCREMENT,
    name_product varchar(50) NOT NULL,
    desc_product text DEFAULT NULL,
    price_product float(7) NOT NULL,
    availability_product tinyint(1) DEFAULT 1,
    img_product varchar (100) DEFAULT "repas.png",
    id_restaurant int NOT NULL,
    id_product_type int NOT NULL,
    PRIMARY KEY (id_product),
    CONSTRAINT product_ibfk_1 FOREIGN KEY (id_restaurant) REFERENCES restaurant (id_restaurant),
    CONSTRAINT product_ibfk_2 FOREIGN KEY (id_product_type) REFERENCES product_type (id_product_type)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE orders (
    id_order int NOT NULL AUTO_INCREMENT,
    accepted int (1) DEFAULT 0,
    state_order int (1) DEFAULT 0,
    time_order datetime NOT NULL,
    pickup_time datetime DEFAULT NULL,
    delivery_time datetime DEFAULT NULL,
    delivery_address varchar(250) NOT NULL,
    id_costumer int NOT NULL,
    id_delivery_man int NOT NULL,
    PRIMARY KEY (id_order),
    CONSTRAINT order_ibfk_1 FOREIGN KEY (id_costumer) REFERENCES costumer (id_costumer),
    CONSTRAINT order_ibfk_2 FOREIGN KEY (id_delivery_man) REFERENCES delivery_man (id_delivery_man)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE constituer (
    id_product int NOT NULL,
    id_order int NOT NULL,
    state_product tinyint (1) DEFAULT 0,
    quantity int (3) NOT NULL,
    PRIMARY KEY (id_order, id_product),
    CONSTRAINT constituer_ibfk_1 FOREIGN KEY (id_order) REFERENCES orders (id_order),
    CONSTRAINT constituer_ibfk_2 FOREIGN KEY (id_product) REFERENCES product (id_product)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE inclure (
    id_restaurant int NOT NULL,
    id_mcv_local int NOT NULL,
    PRIMARY KEY (id_restaurant, id_mcv_local),
    CONSTRAINT inclure_ibfk_1 FOREIGN KEY (id_restaurant) REFERENCES restaurant (id_restaurant),
    CONSTRAINT inclure_ibfk_2 FOREIGN KEY (id_mcv_local) REFERENCES mcv_local (id_mcv_local)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE realiser (
    id_costumer int NOT NULL,
    id_order int NOT NULL,
    PRIMARY KEY (id_costumer, id_order),
    CONSTRAINT realiser_ibfk_1 FOREIGN KEY (id_costumer) REFERENCES costumer (id_costumer),
    CONSTRAINT realiser_ibfk_2 FOREIGN KEY (id_order) REFERENCES orders (id_order)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE avoir (
    id_restaurant int NOT NULL,
    id_product int NOT NULL,
    PRIMARY KEY (id_restaurant, id_product),
    CONSTRAINT avoir_ibfk_1 FOREIGN KEY (id_restaurant) REFERENCES restaurant (id_restaurant),
    CONSTRAINT avoir_ibfk_2 FOREIGN KEY (id_product) REFERENCES product (id_product)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

/*let queryInsert = `INSERT INTO mcv_local (name_mcv_local, phone_mcv_local, mail_mcv_local, login_mcv_local, 
 password_mcv_local,img_mcv_local)   
 VALUES('Lourdes','060606060','lourdes@lourdes.com', 'lourdes', '${bcrypt.hashSync("lourdes", 10)}','lourdes.jpg') `;
 connection.query(queryInsert ,(err, mcv)=>{
 if(err) throw err;
 }); 

queryInsert = `INSERT INTO mcv_local (name_mcv_local, phone_mcv_local, mail_mcv_local, login_mcv_local, 
 password_mcv_local,img_mcv_local)   
 VALUES('Pau','060606060','pau@pau.com', 'pau', '${bcrypt.hashSync("pau", 10)}','pau.jpg') `;
 connection.query(queryInsert ,(err, mcv)=>{
 if(err) throw err;
 });*/
 /*création de la table produit*/
