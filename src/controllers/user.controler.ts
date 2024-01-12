import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model.js";
import { NewUserRequestBody } from "../types/types.js";
import { error } from "console";
import Errorhandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {


      const { name, email, photo, gender,  _id, dob } = req.body;
 
      let user = await User.findById(_id);
      if(user) return res.status(200).json({
        success:true,
        message: `welcome ,  ${user.name}`
      })


      if(!_id || !name || !email || !photo || !gender || !dob )
      return(new Errorhandler("Please add all Field" , 400));
      console.log(req.body);
       user = await User.create({
        name,
        email,
        photo,
        gender,
        _id,
        dob : new Date(dob),
      });
      return res
        .status(201)
        .json({ success: true, message: `welcome ,   ${user.name}` });
    } 

  
)

export const getAllUsers =TryCatch(  async (req,res,next) =>{
   const users = await User.find({});
   return res.status(200).json({
    success : true,
 users,
   } )
});

export const getUser =TryCatch(  async (req,res,next) =>{

const id = req.params.id;
   const user = await User.findById(id)
   if(!user) return  next(new Errorhandler("invalid id", 400))


   return res.status(200).json({
    success : true,
    user,
   } )
});

export const deleteUser =TryCatch(  async (req,res,next) =>{

const id = req.params.id;
   const user = await User.findById(id)
   if(!user) return  next(new Errorhandler("invalid id", 400))

   await user.deleteOne();

   return res.status(200).json({
    success : true,
msg:"user deleted successfull"
   } )
});

