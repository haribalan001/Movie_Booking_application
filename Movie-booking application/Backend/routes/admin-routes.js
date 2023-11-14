const express = require('express');
const router = express.Router();
const {addAdmin, adminLogin, getAdmins, getAdminByID} = require('../controllers/admin-controller');

router.post('/signup', addAdmin);
router.post("/login", adminLogin);
router.get('/',getAdmins);
router.get("/:id", getAdminByID);

module.exports = router;