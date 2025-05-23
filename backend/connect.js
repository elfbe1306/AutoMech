// const { MongoClient, ServerApiVersion } = require('mongodb');
// require('dotenv').config({ path: "./config.env" });

// const client = new MongoClient(process.env.ATLAS_URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// let database;

// module.exports = {
//   ConnectToServer: async () => {
//     await client.connect();
//     database = client.db("AutoMech");
//   },
//   getDatabase: () => database,
//   close: () => client.close(),
// };

// console.log("Connected to server");

// require('dotenv').config({ path: './config.env' });

// const { createClient } = require('@supabase/supabase-js');

// // Use process.env to access your key
// const supabaseUrl = '';
// const supabaseKey = process.env.SUPABASE_KEY;

// const supabase = createClient(supabaseUrl, supabaseKey);

// module.exports = {
//   ConnectToServer: async () => {
//     const { data, error } = await supabase.from('User').select('*');
//     if (error) {
//       console.error('Error connecting to Supabase:', error);
//     } else {
//       console.log('Supabase data:', data);
//     }
//   }
// };