const express=require('express')
const router=express.Router()

const {register,login,edit,viewProfile,createOtp,getAllUser}=require('../controllers/user.controller')


router.post('/register',register)
router.post('/login',login)
router.post('/edit',edit)

router.get('/profile/:id',viewProfile)
router.get('/otp',createOtp)
router.get('/all',getAllUser)


module.exports=router