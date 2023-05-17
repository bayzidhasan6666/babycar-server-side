const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Define a route
app.get('/', (req, res) => {
  res.send('Toy marketplace server is running....');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
