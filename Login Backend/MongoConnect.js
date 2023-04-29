const mongoose = require('mongoose'); // Import mongoose
const dotenv = require('dotenv'); // Import dotenv
dotenv.config(); // Configure dotenv


const connectDB = async () => { // Create a function to connect to MongoDB
    await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }); // Connect to MongoDB
    console.log('Connected to MongoDB'); 
}

module.exports = connectDB; // Export connectDB function
