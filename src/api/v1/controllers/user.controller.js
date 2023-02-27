const {success,badRequest,onError,serverValidation, notFound}=require('../helpers/response_helper')
const bcrypt=require('bcrypt')


const {validationResult}=require('express-validator')
const {generateToken,parseJwt}=require('../middleware/isAuthenticated')
const {randomBytes}=require('crypto')
const userModel=require('../models/user.model')
const {generateOtp}=require('../helpers/user.helper')
module.exports={
    register:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{"message":"error has been occured","errors":errors.array()})
            }else{
                const salt=await bcrypt.genSalt(10)
                let initialPassword=req.body.password;
                let encryptedPassword=await bcrypt.hash(initialPassword,salt)
                
               let data={
                userName:req.body.userName,
                email:req.body.email,
                password:encryptedPassword,
                phone:req.body.phoneNumber
               }
               const userExists=await userModel.findOne({email:data.email})
               if(userExists){
                badRequest(res,'user has already been registered')
               }else{
                const userData=new userModel(data)
               const userDetails=await userData.save()
               if(userDetails){
                const token=generateToken(userDetails)
                success(res,'user has been registered successfully',{userDetails,token})
               }else{
                badRequest(res,'cannot register user right now')
               }
               }
            }
        }catch(error){
            console.log(error)
            onError(res,'api has failed at some level',error)
        }
    },
    login:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{"message":"server validation has been failed","errors":errors.array()})
            }else{
                const data={
                    userName:req.body.userName,
                    password:req.body.password
                }
                const userDetails=await userModel.findOne({userName:data.userName})
                if(userDetails){
                    const passwordMatch=await bcrypt.compare(data.password,userDetails.password)
                    console.log(passwordMatch)
                    if(passwordMatch){
                        const token=generateToken(userDetails)
                        success(res,'user login is successful',{userDetails,token})
                    }else{
                        badRequest(res,'invalid credentials entered')
                    }
                }else{
                    badRequest(res,'invalid credentials entered')
                }
            }
        }catch(error){
            console.log(error)
            onError(res,'api has failed at some level',error)
        }
    },
    edit:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{"message":"server error has occured","errors":errors.array()})
            }else{

                const token=req.headers.authorization
                const data=req.body;
                if(token){
                    const userData=parseJwt(token)
                    const userDetails=await userModel.findByIdAndUpdate(userData.user_id,data,{new:true})
                    userDetails? success(res,'user details has been updated successfully',userDetails):badRequest(res,'cannot find and update user')


                }else{
                    badRequest(res,'enter token in authorization for further process')
                }
            }
        }catch(error){
            console.log(error)
            onError(res,'api has failed at some level',error)
        }
    },
    viewProfile:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{"message":"server error has occured","errors":errors.array()})
            }else{
                const id=req.params.id;
                const userDetails=await userModel.findById(id)
                userDetails ? success(res,'here is the user details',userDetails):notFound(res,'cannot find user this user')
            }

        }catch(error){
            console.log(error)
            onError(res,'api has failed at some level',error)
        }
    },
    createOtp:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{"message":"server error has occured","errors":errors.array()})
            }else{
                const reqId=randomBytes(4).toString('hex')
                const otp=generateOtp()
                otp? success(res,'otp has been generated successfully',{reqId,otp}):notFound(res,'otp can not be created')

            }
        }catch(error){
            console.log(error)
            onError(res,'api has failed at some level',error)
        }
    },
    getAllUser:async(req,res)=>{
        try{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                serverValidation(res,{"message":"server error has occured","errors":errors.array()})
            }else{
                const userList=await userModel.find()
                userList.length>0 ? success(res,'user has found successfully',userList):notFound(res,'users has not yet being register in our app')
            }

        }catch(error){
            console.log(error)
            onError(res,'api has failed at some level',error)
        }
    },
    
}