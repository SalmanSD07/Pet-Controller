const petModel=require('../models/pet.model')
const {success,badRequest,onError,notFound,serverValidation}=require('../helpers/response_helper')

const {validationResult}=require('express-validator')
const { parseJwt } = require('../middleware/isAuthenticated')

module.exports={
    register:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{"message":"server validation has just occured","errors":errors.array()})
            }else{
                const token=req.headers.authorization
                const tokenData=parseJwt(token)
                let data=req.body
                data.userId=tokenData.user_id
                const petData=new petModel(data)
                const petDetails=await petData.save()
                petDetails?success(res,'pet has been registered successfully',petDetails):badRequest(res,'pet cannot be registered due to some reason')
            }

        }catch(error){
            console.log(error)
            onError(res,'api has failed at some level',error)
        }
    },
    addVoices:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{"message":"server error has occured","errors":errors.array()})
            }else{
                const token=req.headers.authorization
                const tokenData=parseJwt(token)
                const userId=tokenData.user_id
                const petId=req.params.petId
                const data=req.body
                
                let petDetails=await petModel.findById(petId)
                // petDetails? success(res,'pet voices has been updated successfully',petDetails): badRequest(res,'pet voices cannot be updated righttt now')

                if(petDetails){
                    if(petDetails.userId==userId){
                        petDetails.voices.push(data)
                        const voicesUpdate=await petDetails.save()
                        voicesUpdate? success(res,'voices of the pet updated successfully',voicesUpdate):badRequest(res,'pet voices can not be updated right now')
                    }else{
                        badRequest(res,'only owner can upgrade its pet voices')
                    }
                }else{
                    notFound(res,'cannot found the pet')
                }

            }
        }catch(error){
            console.log(error)
            onError(res,'api has failed at some level',error)
        }
    },
    addMedication:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{"message":"server validation error has occured","errors":errors.array()})
            }else{
                const token=req.headers.authorization
                const tokenData=parseJwt(token)
                const petId=req.params.petId
                const data=req.body;
                let petDetails=await petModel.findById(petId)
                if(petDetails){
                    if(petDetails.userId==tokenData.user_id){
                        // success(res,'vaccination has been updated successfully')
                        petDetails.vaccinations.push(data)
                        const updateVaccine=await petDetails.save()
                        updateVaccine? success(res,"pet vaccination has been updated successfully",updateVaccine):badRequest(res,"vaccination details could not be updated right now")
                    }else{
                        badRequest(res,'only owner can update its pet information')
                    }
                }else{
                    badRequest(res,"cannot update vaccination details right now")
                }
            }
        }catch(error){
            console.log(error)
            onError(res,'api has failed at some level',error)
        }
    },
    getPet:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{"message":"server validation error has occured","errors":errors.array()})
            }else{
                const token=req.headers.authorization;
                const tokenData=parseJwt(token)
                const userId=tokenData.user_id
                const petId=req.params.petId
                const petDetails=await petModel.findById(petId)
                if(petDetails){
                    if(petDetails.userId==userId){
                        success(res,'heres the pet info',petDetails)
                    }else{
                        badRequest(res,'only the owner can view its pet details')
                    }
                }else{
                    notFound(res,'specified pet cannot be found')
                }

            }
        }catch(error){
            console.log(error)
            onError(res,"api has failed at some level",error)
        }
    },
    editPet:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{"message":"server validatin error has occured","errors":errors.array()})
            }else{
                const token=req.headers.authorization
                const tokenData=parseJwt(token)
                const userId=tokenData.user_id
                const petId=req.params.petId
                const data=req.body
                const updatedPet=await petModel.findByIdAndUpdate(petId,data,{new:true})
                if(updatedPet){
                    if(updatedPet.userId==userId){
                        success(res,'pet has been updated successfully',updatedPet)
                    }else{
                        badRequest(res,'only owner can update pet information')
                    }
                }else{
                    notFound(res,'pet details could not be updated')
                }
            }
        }catch(error){
            console.log(error)
            onError(res,'api has failed at some point',error)
        }
    },
    userPet:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{"message":"server validation error has occured","errors":errors.array()})
            }else{
                const token=req.headers.authorization
                const tokenData=parseJwt(token)
                const userId=tokenData.user_id
                const petList=await petModel.find({userId:userId,"status":"active"})
                petList.length>0 ? success(res,'heres the pet list of the user',petList): badRequest(res,'cannot find user pet')
            }
        }catch(error){
            console.log(error)
            onError(res,'api has failed at some level',error)
        }
    },
    changePetStatus:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{"message":"server validation error has occured","errors":errors.array()})
            }else{
                const petId=req.params.petId
                const token=req.headers.authorization
                const tokenData=parseJwt(token)
                const userId=tokenData.user_id
                const status=req.body.status;
                let petData=await petModel.findById(petId)
                if(petData){
                    if(petData.userId==userId){
                        petData.status=status
                        const petDetails=await petData.save()
                        petDetails? success(res,'pet status has been changed successfully',petDetails):badRequest(res,'pet status could not change right now')
                    }
                }else{
                    notFound(res,'pet cannot be found')
                }
            }
        }catch(error){
            console.log(error)
            onError(res,"api has failed at some level",error)
        }
    }
}