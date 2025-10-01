const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('🤖 ImperiumAI Backend is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Voeg dit toe aan je backend (index.js of app.js):
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
// Voeg dit toe VOOR je routes app.use((req, res, next) => { res.header('Access-Control-Allow-Origin', '*'); res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS'); res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); next(); }); // Of gebruik de cors package: // npm install cors const cors = require('cors'); app.use(cors());
