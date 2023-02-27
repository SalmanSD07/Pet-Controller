const {success,badRequest,notFound,serverValidation,onError}=require('../helpers/response_helper')
const bcrypt=require('bcrypt')
const {validationResult}=require('express-validator')
const adminModel=require('../models/admin.model')
const userModel=require('../models/user.model')
const petModel=require('../models/pet.model')
const { adminToken, parseJwt } = require('../middleware/isAuthenticated')


module.exports={
    register:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
            serverValidation(res,{"message":"server error has occured","errors":errors.array()})  
            }else{
                let data=req.body;
                const adminInfo=await adminModel.find()
                if(adminInfo.length>0){
                    badRequest(res,'admin has already been registered')
                }else{
                    const salt=await bcrypt.genSalt(10)
                let encryptedPassword=await bcrypt.hash(data.password,salt)
                data.password=encryptedPassword
                const adminData=new adminModel(data)
                const adminDetails=await adminData.save()
                // adminDetails? success(res,'admin is being registered successfully',adminDetails) : notFound(res,'admin cannot be registered right now')
                if(adminDetails){
                    const token=adminToken(adminDetails)
                    success(res,'admin is being registered successfully',{adminDetails,token})
                }else{
                    badRequest(res,'user cannot be registered right now')
                }
                }
                

            }
        }catch(error){
            console.log(error)
            onError(res,'api has failed')
        }
    },
    login:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{"message":"servver error has occured","errors":errors.array()})
            }else{
                const data={
                    email:req.body.email,
                    password:req.body.password
                }
                const adminDetails=await adminModel.findOne({email:data.email})
                if(adminDetails){
                    const passwordMatch=bcrypt.compare(data.password,adminDetails.password)
                    const token=adminToken(adminDetails)
                    passwordMatch?success(res,'admin login is successful',{adminDetails,token}): notFound(res,'admin credentials does not match')
                    
                }else{
                    notFound(res,'admin credentials does not match')
                }

            }

        }catch(error){
            console.log(error)
            onError(res,'api has failed at some level',error)
        }
    },
    getAdmin:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{"message":"server error has occured","errors":errors.array()})
            }else{
                const adminDetails=await adminModel.find()
                adminDetails.length>0 ? success(res,'heres the admin Details',adminDetails[0]): notFound(res,'cannot find admin Details')
            }
        }catch(error){
            console.log(error)
            onError(res,'api has failed at some level',error)
        }
    },
    editAdmin:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{"message":"server validation error occured","errors":errors.array()})
            }else{
                const token=req.headers.authorization
                const tokenData=parseJwt(token)

                const adminId=tokenData.user_id
                let data=req.body
                if(data.password){
                    const salt=await bcrypt.genSalt(10)
                    data.password=await bcrypt.hash(data.password,salt)
                }
                const updatedAdmin=await adminModel.findByIdAndUpdate(adminId,data,{new:true})
                updatedAdmin? success(res,'admin has been updated successfully',updatedAdmin):badRequest(res,'admin details cannot be updated due to some reasons')
            }
        }catch(error){
            console.log(error)
            onError(res,'api has failed at some level',error)
        }
    },
    getUser:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{message:"server validation error has just occured",error:errors.array()})
            }else{
                const users=await userModel.find()
                users.length>0 ? success(res,'here is the list of users',users):notFound(res,'no user found to show')
            }
        }catch(error){
            console.log(error)
            onError(res,'api has failed at some level',error)
        }
    },
    getPets:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{message:"server validation has occured",errors:errors.array()})
            }else{
                const pets=await petModel.find()
                pets.length>0 ? success(res,'heres all the pet',pets):notFound(res,'no pet found in db')
            }
        }catch(error){
            console.log(error)
            onError(res,'api has failed at some level',error)
        }
    }

}