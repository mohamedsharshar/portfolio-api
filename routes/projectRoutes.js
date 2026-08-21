const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/', projectController.getAllProjects);

router.post('/', projectController.addProject);

router.put('/', projectController.editProject);

router.delete('/', projectController.deleteProject);

module.exports = router;