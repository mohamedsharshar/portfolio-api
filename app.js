const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();


app.use(cors());
app.use(express.json()); 

// تجربة بسيطة للاتصال بالداتا بيز
app.get('/', async (req, res) => {
    try {
        // بنحاول نجيب أي حاجة من الداتا بيز عشان نتأكد إنها شغالة
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.send(`السيرفر شغال والاتصال بالداتا بيز ناجح! النتيجة: ${rows[0].solution}`);
    } catch (error) {
        res.send(`في مشكلة في الاتصال بالداتا بيز: ${error.message}`);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});