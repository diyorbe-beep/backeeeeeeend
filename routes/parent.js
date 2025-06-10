const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parent');

router.get('/', parentController.getAllParents);
router.post('/', parentController.createParent);
router.get('/student/:studentId', parentController.getParentByStudentId);

module.exports = router;
