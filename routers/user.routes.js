const express = require("express");
const { createUser, editUser, deleteUser, getUser, getAllUsers, login, verifyUser, getMe } = require("../controllers/user.controller");
const router  = express.Router();


router.post('/register', createUser)
router.patch('/edituser/:id', editUser)
router.delete('/deleteuser/:id', deleteUser)
router.get('/allusers',verifyUser, getAllUsers)
router.get('/getuser/:id', getUser)
router.post('/login', login)
router.get('/me', verifyUser, getMe)

module.exports = router;