const express=require('express')
const router=express.Router()


const {register,getAdmin,editAdmin,login, getUser,getPets}=require('../controllers/admin.controller')


const {authenticateAdmin}=require('../middleware/isAuthenticated')

router.post('/register',register)
router.post('/login',login)
router.get('/',authenticateAdmin,getAdmin)
router.post('/edit',authenticateAdmin,editAdmin)
router.get('/all/users',authenticateAdmin,getUser)
router.get('/all/pets',authenticateAdmin,getPets)

module.exports=router


