const {forbidden,unauthorized}=require('../helpers/response_helper')
const dotenv=require('dotenv')
dotenv.config()

const jwt=require('jsonwebtoken')

const secret=process.env.USER_SECRET
const adminSecret=process.env.ADMIN_SECRET

function generateToken(data){
    return jwt.sign(
        {
          
          user_password: data.email,
          user_id: data._id,
        },
        secret,
        
      );
    
  };
  function adminToken(data){
    return jwt.sign({
      user_id:data._id
    },
    adminSecret
    )
  }

  function authenticateUser(req, res, next) {
    let authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, secret, (err) => {
        if (err) {
          return forbidden(res,'token cannot be verified')
        }
        next();
      });
    } else {
      unauthorized(res,'authorization token needs to be added in the header')
    }
  }


  function authenticateAdmin(req,res,next){
    let authHeader=req.headers.authorization
    if(authHeader){
      const token=authHeader.split(" ")[1];
      jwt.verify(token,adminSecret,(err)=>{
        if(err){
          return forbidden(res,'admin token cannot be verified')
        }
        next()
      })
    }else{
      unauthorized(res,'authorization token need to be added in the header')
    }
  }
  function parseJwt(data) {
    try {
      let token = data.slice(7);
      const decode = Buffer.from(token.split(".")[1], "base64");
      const toString = decode.toString();
      return JSON.parse(toString);
    } catch (e) {
      return null;
    }
  }

  module.exports={
    generateToken,
    parseJwt,
    authenticateUser,
    adminToken,
    authenticateAdmin
  }
