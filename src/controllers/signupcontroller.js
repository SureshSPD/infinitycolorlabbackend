// controllers/userController.js
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const userController = {
  async signup(req, res) {
    try {
      const { name, email, phone, accessRole } = req.body;

      // Check for empty fields
      if (!name || !email || !phone || !accessRole) {
        return res.status(400).json({ message: 'Please fill in all fields' });
      }
      // Check email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      // Auto-generate password
      const generatedPassword = `${name.slice(0, 3)}${phone.slice(0, 3)}`;
      // Hash the generated password
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      // Create a new user object
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        accessRole,
      });

      // Save the new user
      await newUser.save();

      res.status(201).json({ message: 'User signed up successfully', user: newUser });
    } catch (error) {
      res.status(400).json({ message: 'Error in user signup', error: error.message });
    }
  },

  async  signin(req, res) {
    try {
      const { email, password } = req.body;
  
      // Check for empty fields
      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
      }
  
      // Find the user by email
      const user = await User.findOne({ email });
  
      // Check if the user exists
      if (!user) {
        return res.status(401).json({ message: 'Email not correct' });
      }
  
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Password not correct' });
      }
  
      // Successful sign-in
      res.status(200).json({ message: 'Sign-in successful', user });
    } catch (error) {
      res.status(400).json({ message: 'Error in user sign-in', error: error.message });
    }
  },

  async addOrderDetails(req, res) {
    try {
      const { email } = req.body;
      const {
        orderNumber,
        date,
        salesPerson,
        inchargePerson,
        clientDetails,
        deliveryDate,
        status,
      } = req.body;
  
      // Check if the email is provided
      if (!email) {
        return res.status(400).json({ message: 'Email is required in the request body' });
      }
  
      // Find the user by email
      const user = await User.findOne({ email });
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Add order information to the array
      user.orderInformation.push({
        orderNumber,
        date,
        salesPerson,
        inchargePerson,
        clientDetails,
        deliveryDate,
        status,
      });
  
      // Save the user with the updated order information
      await user.save();
  
      res.status(201).json({ message: 'Order details added successfully', user });
    } catch (error) {
      console.error('Error in adding order details:', error);
      res.status(400).json({ message: 'Error in adding order details', error: error.message });
    }
  },
  async getAllUsers(req, res) {
    try {
      // Find all users
      const users = await User.find();

      res.status(200).json({ message: 'All users retrieved successfully', users });
    } catch (error) {
      console.error('Error in getting all users:', error);
      res.status(400).json({ message: 'Error in getting all users', error: error.message });
    }
  },
  
  

  // ... Add other controller methods as needed
};

module.exports = userController;
