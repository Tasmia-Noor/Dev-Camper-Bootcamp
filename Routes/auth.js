// User register encrypting passwords
const express = require('express')
const {protect} = require('../Middleware/auth')
const router = express.Router()


const {register, login, getMe, ForgetPassword, resetPassword,updatePassword, updateDetails, deleteUser, logout} = require ('../Controllers/auth')


router.post('/register', register)
router.post('/login', login)
router.post('/forgetPassword', ForgetPassword)
router.put('/resetPassword/:resettoken', resetPassword)
router.put('/updatePassword', protect, updatePassword);
router.put('/updateDetails', protect, updateDetails);
router.delete('/deleteUser', protect, deleteUser);
router.get('/me',protect, getMe)
router.get('/logout', logout);

module.exports = router