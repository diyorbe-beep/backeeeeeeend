const express = require('express');
const { getServices, createService } = require('../controllers/services');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(protect, authorize('admin'), createService);

module.exports = router;