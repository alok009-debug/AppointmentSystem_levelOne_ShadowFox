const testController = require('../controllers/test.controller');

const express = require('express');
const router = express();

router.get('/health', testController);

module.exports=router;