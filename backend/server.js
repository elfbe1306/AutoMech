const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = 3000;

// === Supabase Connection ===
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// === Inject Supabase into each request (optional but useful) ===
app.use((request, response, next) => {
  request.supabase = supabase;
  next();
});

// === Routes ===
// Example: use routes and pass supabase
const userRoutes = require('./Routes/userRoutes');
app.use(userRoutes); // userRoutes will access request.supabase

// Chapter2 Routes
const Chapter2Routes = require('./Routes/chap2Routes')
app.use(Chapter2Routes); // Chapter2Routes will access request.supabase

// Chapter3 Routes
const Chapter3Routes = require('./Routes/chap3Routes')
app.use(Chapter3Routes); // Chapter3Routes will access request.supabase

// // Chapter4 Routes
const Chapter4Routes = require('./Routes/chap4Routes')
app.use(Chapter4Routes); // Chapter4Routes will access request.supabase

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
