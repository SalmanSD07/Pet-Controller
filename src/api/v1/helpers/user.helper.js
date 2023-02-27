const bcrypt=require('bcrypt')
const userModel=require('../models/user.model')




async function registerUser(data){
    try {
      
      const salt = await bcrypt.genSalt(10)
      let encryptedPassword = await bcrypt.hash(data.password, salt)
      // const encryptedPassword = await encryption(data.password);
      const fomattedData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: encryptedPassword,
      };
      const saveData = new userModel(fomattedData);
      const userData=await saveData.save()
      return userData ? userData : false;
    } catch (error) {
      return false;
    }
  }

  async function getUser(id){
    try{
        const userDetails=await userModel.findById(id)
        return userDetails? userDetails:false

    }catch(error){
        return false
    }
  }

  function generateOtp() {
    var digits = "123456789"
    var otp = ""
    for (let i = 1; i <= 6; i++) {
        const num = digits[Math.floor((Math.random() * 9))]
        otp += num
    }

    return otp
}

  module.exports={
    registerUser,
    getUser,
    generateOtp
  }