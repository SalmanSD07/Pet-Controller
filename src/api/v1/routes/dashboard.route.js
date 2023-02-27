const express=require('express')
const router=express.Router()

const {recentlyAddedPet,getCategory,petsByCategory}=require('../controllers/dashboard.controller')


router.get('/recent/dog',recentlyAddedPet)
router.get('/category/:type',getCategory)
router.get('/petByCategory',petsByCategory)



module.exports=router