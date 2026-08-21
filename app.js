const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const projectRoutes = require('./routes/projectRoutes'); 

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => {
    res.send('مرحباً بك في API البورتفوليو الخاص بي!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});