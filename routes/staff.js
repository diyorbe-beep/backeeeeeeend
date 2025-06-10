const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff');

router.get('/', staffController.getAllStaff);
router.post('/', staffController.createStaff);
router.get('/:id', staffController.getStaffById);
router.put('/:id', staffController.updateStaff);
router.delete('/:id', staffController.deleteStaff);

module.exports = router;
