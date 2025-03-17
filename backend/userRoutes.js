const express = require('express')
const database = require('./connect')
const bcrypt = require('bcrypt')

let userRoutes = express.Router();

//#1 Create account
userRoutes.route('/Users').post(async (request, response) => {
  try {
    let db = database.getDatabase();

    const takenEmail = await db.collection('Users').findOne({ email: request.body.email });
    if (takenEmail) {
      return response.status(400).json({ message: 'The email is taken' });
    }

    const hashPassword = await bcrypt.hash(request.body.password, 6)

    let userCreateAccount = {
      email: request.body.email,
      password: hashPassword,
    };

    let data = await db.collection('Users').insertOne(userCreateAccount);
    response.status(201).json(data);
  } catch (error) {
    response.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
})

//#2 Login
userRoutes.route('/Users/Login').post(async (request, response) => {
  let db = database.getDatabase();
  const user = await db.collection('Users').findOne({ email : request.body.email });

  if (!user) {
    return response.status(404).json({ success: false, message: "User not found" });
  }

  let confirmation = await bcrypt.compare(request.body.password, user.password);
  if (!confirmation) {
    return response.status(401).json({ success: false, message: "Incorrect password" });
  }

  response.status(200).json({ success: true, message: "Login successful", userId: user._id });
});

module.exports = userRoutes