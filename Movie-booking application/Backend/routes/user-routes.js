const express = require('express');
const router = express.Router();
const {
    getAllUsers, 
    signup, 
    getUserById,
    updateUser, 
    deleteUser, 
    login,
    getUserBooking} = require('../controllers/user-controller');

router.route('/').get(getAllUsers);
router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);
router.route('/booking/:id').get(getUserBooking);

module.exports = router;