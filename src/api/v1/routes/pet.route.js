const express=require('express')
const router=express.Router()

const {register,addVoices,addMedication,getPet,editPet,userPet,changePetStatus}=require('../controllers/pet.controller')

router.post('/onBoard',register)
router.post('/addVoices/:petId',addVoices)
router.post('/addVaccination/:petId',addMedication)
router.get('/unique/:petId',getPet)
router.post('/edit/:petId',editPet)
router.get('/user',userPet)
router.post('/changeStatus/:petId',changePetStatus)


module.exports=router