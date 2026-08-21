const db = require('../config/db');

exports.getAllProjects = async (req, res) => {
    try {
        const [projects] = await db.query('SELECT * FROM projects');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "خطأ في جلب المشاريع", error: error.message });
    }
};

exports.addProject = async (req, res) => {
    const { title, description, tech_stack, github_link, live_link, image_url } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO projects (title, description, tech_stack, github_link, live_link, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, tech_stack, github_link, live_link, image_url]
        );
        res.status(201).json({ message: "تم إضافة المشروع بنجاح!", id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "خطأ في إضافة المشروع", error: error.message });
    }
};

exports.editProject=async(req,res)=>{
    const { id,title, description, tech_stack, github_link, live_link, image_url } = req.body;
    try{
        const [result] = await db.query(
            'UPDATE projects SET title = ?, description = ?, tech_stack = ?, github_link = ?, live_link = ?, image_url = ? WHERE id = ?',
            [title, description, tech_stack, github_link, live_link, image_url, id]
        );
        res.status(201).json({ message: "تم تعديل المشروع بنجاح!"});
    } catch (error) {
        res.status(500).json({ message: "خطأ في تعديل المشروع", error: error.message });
    }

}

exports.deleteProject = async (req, res) => {
    const { id } = req.body;
    try {
        const [result] = await db.query(
            'DELETE FROM projects WHERE id = ?',
            [id]
        );
        res.status(201).json({ message: "تم حذف المشروع بنجاح!"});
    } catch (error) {
        res.status(500).json({ message: "خطأ في حذف المشروع", error: error.message });
    }
}