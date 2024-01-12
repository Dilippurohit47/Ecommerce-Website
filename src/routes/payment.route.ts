import express from "express"
import { allCoupons, applyDiscount, createPaymentIntent, deleteCoupon, newCoupon } from "../controllers/payment.controller.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();

// route - /api/v1/payemnt /coupon/new

app.post("/create"  , createPaymentIntent)

app.get("/discount",applyDiscount);

app.post("/coupon/new", adminOnly,  newCoupon)


app.get("/coupon/all", adminOnly,allCoupons);

app.delete("/coupon/:id", adminOnly,deleteCoupon);



export  default app;