import express from "express";

import { adminOnly } from "../middlewares/auth.js";
import { allorder, deleteOrder, getSingleOrder, myOrder, newOrder, processOrder } from "../controllers/order.controller.js";


const app = express.Router();

app.post("/new",newOrder);
app.get("/my",myOrder)
app.get("/all", adminOnly,allorder)
app.route("/:id").get(getSingleOrder).put(adminOnly,processOrder).delete(adminOnly,deleteOrder)



export default app;