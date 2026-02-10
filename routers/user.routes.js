const express = require("express");
const { createUser, editUser, deleteUser, getUser, getAllUsers } = require("../controllers/user.controller");
const router  = express.Router();


router.post('/register', createUser)
router.patch('/edituser/:id', editUser)
router.delete('/deleteuser/:id', deleteUser)
router.get('/allusers', getAllUsers)
router.get('/getuser/:id', getUser)

module.exports = router;