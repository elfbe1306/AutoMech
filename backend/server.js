const connect = require('./connect');
const express = require('express');
const cors = require('cors');
const userRoutes = require('./userRoutes');
const chap2Routes = require('./chap2Routes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(chap2Routes);

app.listen(PORT, async () => {
  connect.ConnectToServer();
  console.log(`Server is running on port: ${PORT}`);
}
);