const nodemailer = require('nodemailer');
const db = require('../config/db');

const sendContactEmail = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'يرجى ملء جميع الحقول.' });
    }

    try {
        // حفظ الرسالة في قاعدة البيانات أولاً
        const insertQuery = `INSERT INTO messages (name, email, message) VALUES (?, ?, ?)`;
        await db.query(insertQuery, [name, email, message]);

        // إعداد Nodemailer باستخدام Gmail
        // ملاحظة هامة: يجب عليك تفعيل 2-Step Verification في حساب جوجل وإنشاء App Password
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mmshsh05@gmail.com', // ضع بريدك الإلكتروني هنا
                pass: 'YOUR_APP_PASSWORD'     // ضع كلمة مرور التطبيق (App Password) الخاصة بـ Gmail هنا
            }
        });

        const mailOptions = {
            from: 'Portfolio Contact Form <mmshsh05@gmail.com>', 
            to: 'mmshsh05@gmail.com',   // البريد الذي سيستلم الرسالة
            replyTo: email,               // للرد على الشخص مباشرة
            subject: `رسالة جديدة من بورتفوليو عبر: ${name}`,
            text: `الاسم: ${name}\nالبريد الإلكتروني: ${email}\n\nالرسالة:\n${message}`,
            html: `<p><strong>الاسم:</strong> ${name}</p>
                   <p><strong>البريد الإلكتروني:</strong> ${email}</p>
                   <p><strong>الرسالة:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>`
        };

        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ message: 'تم إرسال رسالتك بنجاح!' });
    } catch (error) {
        console.error('خطأ في إرسال البريد:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة لاحقاً.' });
    }
};

module.exports = {
    sendContactEmail
};
