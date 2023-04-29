const mongoose = require('mongoose'); // Import mongoose

const userschema = new mongoose.Schema({ // Create a schema for user
    email:{ // Create a field for email
        type: String,
        required: true,
        unique: true,

    },
    password:{ // Create a field for password
        type: String,
        required: true,
    },
    tokens: [{ // Create a field for tokens
        token: {
            type: String,
            required: true
        }
    }, // Create a field for history
    ]
}    

);

const User = mongoose.model('User', userschema); // Create a model for user

module.exports = User; // Export User model
