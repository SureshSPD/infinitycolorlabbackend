const express = require('express');
const router = express.Router();
const userController = require('../controllers/signupcontroller');



// Signup route
router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.post('/add-order-details', userController.addOrderDetails); // New route for adding order details
router.get('/all-users', userController.getAllUsers); 


module.exports = router;
