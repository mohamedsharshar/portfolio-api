const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// مسار إرسال البريد الإلكتروني للاتصال
router.post('/', contactController.sendContactEmail);

module.exports = router;
