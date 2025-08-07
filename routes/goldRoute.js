const express = require('express');
const router = express.Router();
const goldController = require('../controllers/goldController');

router.get('/', goldController.getGold);
router.post('/', goldController.addGold);

module.exports = router;
