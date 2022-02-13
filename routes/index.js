var express = require('express');
var router = express.Router();
const messageController = require("../controllers/messageController");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const passport = require('passport');
/* GET home page. */
router.get('/', messageController.index);
//routes for user login
router.get('/login',authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout',authController.logout);
router.get('/signup',authController.user_signup_get);
router.post('/signup',authController.user_signup_post);

//routes for messages
router.get('/message/create', messageController.message_create_get);
router.post('/message/create', messageController.message_create_post);
router.get('/message/:id/update', messageController.message_update_get);
router.post('/message/:id/update', messageController.message_update_post);
router.get('/message/:id/delete',messageController.delete_get);
router.post('/message/:id/delete',messageController.delete_post);

//routes for becoming an admin
router.get('/admin',userController.admin_get);
router.post('/admin',userController.admin_post);

//Becoming a membership
router.get('/member',userController.membership_get);
router.post('/member',userController.membership_post);


module.exports = router;
