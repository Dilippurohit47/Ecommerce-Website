import { NextFunction, Request, Response } from "express";
import { ApplyBasicQueryCasting } from "mongoose";

export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;

  _id: string;
  dob: Date;
}



export interface newProductRequestBody {
  name: string;
  category: string;
  
price : Number;
stock : Number;
}


export type controllerType = (
  req: Request<any>,
  res: Response,
  next: NextFunction
) =>  Promise<void | Response<any, Record<string, any>>>


export type SearchRequestQuery = {

search?:string;
price?:string;
category?:string;
sort?:string;
page?:string;


}

export interface BaseQuery  {

name?:{
  $regex : string,
  $options: string,
},

price ?:{
  $lte : number},
category ?:string;


}

export type invalidateCacheTypeProps = {
 
   product?:boolean;
   order?:boolean;
   admin?:boolean;
   userId?:string;
   orderId?:string;
   productId?:string;

}


export type OrderItemType = 
{
  name : string;
  photo : string,
  price : number,
  quantity : number,
  productid : string | string[];


}

export type shippingInfoType = 
{
  address : string;
  city : string,
  state : string,
  country : string,
  pincode : number;


}
export interface NewOrderRequestBody  {
  shippingInfo :shippingInfoType;
  user :string;
  subtotal : number;
  tax : number;
  shippingCharges : number;
  discount : number;
  total : number;
  orderItems:OrderItemType[];

}