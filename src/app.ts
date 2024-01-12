import express  from 'express'
import { connectDB } from './utils/feature.js';
import { errorMiddleware } from './middlewares/error.js';
import NodeCache from  "node-cache"
import { config } from "dotenv"
import  morgan from "morgan"
//importing routes
import userRoute from './routes/user.routes.js'
import productRoute from "./routes/products.route.js"

import orderRoute from "./routes/orders.route.js"

import paymentRoute from './routes/payment.route.js'

import dashboardRoute from './routes/stats.route.js'

import cors from "cors"
import Stripe from 'stripe';

config({
  path:"./.env"  
})

const port = process.env.PORT ||  3000;
const  mongo_uri= process.env.MONGO_URI || "";
const  stripeKey= process.env.STRIPE_KEY || "";


connectDB(mongo_uri);

export const stripe = new Stripe(stripeKey)
export const myCache = new  NodeCache() ;


const app = express();
app.use(express.json());


app.use(morgan("dev"))

app.use(cors({
  origin: "http://localhost:5173"
}));


app.get("/" ,(req,res)=>{
    res.send("API Working with /api/v1")

})

//using routes 
app.use("/api/v1/user",userRoute)
app.use("/api/v1/product",productRoute )
app.use("/api/v1/order",orderRoute )


app.use("/api/v1/payment",paymentRoute )

app.use("/api/v1/dashboard",dashboardRoute )


app.use("/uploads",express.static("uploads")) //for to acces uload folder
app.use(errorMiddleware);

app.listen(port,()=>{
console.log(`server is running on  http://localhost:${port} `)
})