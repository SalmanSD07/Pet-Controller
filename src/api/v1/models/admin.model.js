const mongoose=require('mongoose')
const Schema=mongoose.Schema

const adminSchema=new Schema({
    fullName:{type:String},
    email:{type:String,unique:true},
    password:{type:String}
})

const adminModel=mongoose.model('admin',adminSchema)

module.exports=adminModel