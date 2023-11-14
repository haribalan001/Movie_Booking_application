const express = require('express');
const router = express.Router();

const { booking, deleteBooking } = require('../controllers/booking-controller');

router.post("/", booking);
router.delete('/:id', deleteBooking);
 
module.exports = router;