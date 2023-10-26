const User = require('../models/user');
const db = require('../database');
const jwt = require('jsonwebtoken')
const SECRET_KEY = '5bh(76Hn7B5<pdz';
const bcrypt = require('bcrypt');

    const user = new User(db);

    async function registerUser(request, response) {
        try {
            const { firstName, middleInitial, lastName, gender, phoneNumber, street, barangay, city, province, email, password } = request.body;
            
            // Hash the password before storing it in the database
            const hashedPassword = bcrypt.hashSync(password, 10);
    
            const userData = {
                firstName,
                middleInitial,
                lastName,
                gender,
                phoneNumber,
                street,
                barangay,
                city,
                province,
                email,
                password: hashedPassword
            };
    
            const insertedUserId = await user.insertUser(userData);
    
            // Generate a JWT for the registered user
            const tokenPayload = { id: insertedUserId, email };
            const token = jwt.sign(tokenPayload, SECRET_KEY, {
                expiresIn: '1h' // Set the token to expire in 1 hour
            });
    
            response.status(200).send({ message: 'User registered successfully!', userId: insertedUserId, token });
    
        } catch(error) {
            console.error(error);
            response.status(500).send({ message: 'Server error', error: error.message });
        }
    }

    async function loginUser(request, response) {
        try {
            const { email, password } = request.body;
            const userData = { email, password };
            const fetchedUser = await user.fetchUser(userData);
    
            if (fetchedUser) {
                // Generate a JWT with an expiration
                const tokenPayload = { 
                    id: fetchedUser.id, 
                    email: fetchedUser.email 
                };
    
                const token = jwt.sign(tokenPayload, SECRET_KEY, {
                    expiresIn: '1h' // Set the token to expire in 1 hour
                });
    
                response.json({ success: true, user: fetchedUser, token: token });
            } else {
                response.status(401).json({ success: false, message: "Invalid credentials!" });
            }
    
        } catch(error) {
            console.error(error);
            response.status(500).json({ success: false, message: "Server error." });
        }
    }

module.exports = {
    registerUser,
    loginUser,
};
