const express = require('express');
const router = express.Router();
const {
  create,
  getAll,
  getOne,
  updateStatus,
  remove,
} = require('../controllers/appointmentController');

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getOne);
router.patch('/:id/status', updateStatus);
router.delete('/:id', remove);

module.exports = router;