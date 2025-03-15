const connect = require('./connect.cjs');
const express = require('express');
const cors = require('cors');
const posts = require('./postRoute.js');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(posts);

app.listen(port, async () => {
  connect.ConnectToServer();
  console.log(`Server is running on port: ${port}`);
}
);