const mongoose=require('mongoose')
const Schema=mongoose.Schema

const voicesSchema=new Schema({
    name:{type:String},
    icon:{type:String},
    value:{type:String}
})

const petSchema=new Schema({
    userId:{type:String},
    name:{type:String,required:true},
    image:{type:String},
    age:{type:Number},
    breed:{type:String,},
    sex:{type:String,enum:["male","female"]},
    weight:{type:Number},
    voices:[voicesSchema],
    status:{type:String,enum:["active","deactive"],default:"active"},
    vaccinations:[{
        name:{type:String},
        date:{type:String}
    }]
})

const petModel=mongoose.model('pet',petSchema)

module.exports=petModel