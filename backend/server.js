const connect = require('./connect');
const express = require('express');
const cors = require('cors');
const userRoutes = require('./userRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(userRoutes);

app.listen(PORT, async () => {
  connect.ConnectToServer();
  console.log(`Server is running on port: ${PORT}`);
}
);