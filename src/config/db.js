require("dotenv").config();

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // const mongoURI = 'mongodb+srv://insights:Z0w0WApMEeCCxVPH@cluster0.zbv6rz3.mongodb.net/LicenseInsights?retryWrites=true&w=majority';
    const mongoURI = "mongodb+srv://Suresh:Sureshspd@cluster0.wdsjei4.mongodb.net/?retryWrites=true&w=majority";

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Other options as needed for your application
    });

    console.log('Connected to MongoDB!');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

