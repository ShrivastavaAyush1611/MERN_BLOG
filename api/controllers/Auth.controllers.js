import { handleErrors } from "../helpers/handleErrors.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs";

import jwt from 'jsonwebtoken'

export const Register = async(req,res,next)=>{

    try{
        const {name,email,password,avatar}=req.body // Include avatar in destructuring
        const checkuser=await User.findOne({email})
        if(checkuser){
            //user already exist
            next(handleErrors(409,'user already Registered.'))
        }
        const hashedPassword = bcrypt.hashSync(password)
        const user = new User({
            name,
            email,
            password:hashedPassword,
            avatar: avatar || '' // Default avatar to an empty string if not provided
        })
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Registration Successful'
        })
    }catch(error){
        console.log(error)
       next(handleErrors(500,error.message))
    }

}

export const Login = async(req,res,next)=>{
    try {
      const{email,password}=req.body
      const user = await User.findOne({email})
      if(!user){
        next(handleErrors(404,'Invalid Login Credentials'))
      }
      const hashedpassword = user.password;
      const comparePassword = bcrypt.compare(password,hashedpassword)
      if(!comparePassword){
        next(handleErrors(404,'Invalid Login Credentials'))
      }

      const token = jwt.sign({
        _id:user._id,   //This is the payload (data stored in the token).
        name:user.name,
        email:user.email,
        avatar:user.avatar,
        role: user.role // Add role to the token payload
      },
      process.env.JWT_SECRET,//This is a secret key used to sign the token, preventing unauthorized tampering.
    )
    res.cookie('access_token',token,{   
        httpOnly:true,// Cookie is not accessible via JavaScript
        secure: process.env.NODE_ENV === 'production',// Uses HTTPS in production
        sameSite: process.env.NODE_ENV ==='production' ? 'none':'strict',// Handles cross-site security
        path:'/'// Cookie is available for all API requests
    })

    const newUser = user.toObject({getters:true})
    delete newUser.password
     res.status(200).json({
      success:true,
      user:newUser,
      message:"Login successful"
     })

    } catch (error) {
        next(handleErrors(500,error.message))
    }
}

export const GoogleLogin = async(req,res,next)=>{
    try {
      const{email,name,avatar}=req.body
      let user
      user = await User.findOne({email})
      if(!user){
       //Create new user
       const password = Math.random().toString()
       const hashedPassword = bcrypt.hashSync(password)
       const newUser = new User({
          name,
          email,
          password:hashedPassword,
          avatar: avatar || '' // Default avatar to an empty string if not provided
       })

       user = await newUser.save() 
      }
     

      const token = jwt.sign({
        _id:user._id,   //This is the payload (data stored in the token).
        name:user.name,
        email:user.email,
        avatar:user.avatar,
        role: user.role // Add role to the token payload
      },
      process.env.JWT_SECRET,//This is a secret key used to sign the token, preventing unauthorized tampering.
    )
    res.cookie('access_token',token,{   
        httpOnly:true,// Cookie is not accessible via JavaScript
        secure: process.env.NODE_ENV === 'production',// Uses HTTPS in production
        sameSite: process.env.NODE_ENV ==='production' ? 'none':'strict',// Handles cross-site security
        path:'/'// Cookie is available for all API requests
    })

    const newUser = user.toObject({getters:true})
    delete newUser.password
     res.status(200).json({
      success:true,
      user:newUser,
      message:"Login successful"
     })

    } catch (error) {
        next(handleErrors(500,error.message))
    }
}

export const Logout = async(req,res,next)=>{
  try {
    
  res.clearCookie('access_token',{   
      httpOnly:true,// Cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV === 'production',// Uses HTTPS in production
      sameSite: process.env.NODE_ENV ==='production' ? 'none':'strict',// Handles cross-site security
      path:'/'// Cookie is available for all API requests
  })
   res.status(200).json({
    success:true,
    message:"Logout successful"
   })

  } catch (error) {
      next(handleErrors(500,error.message))
  }
}
