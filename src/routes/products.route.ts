import express from "express"
import { adminOnly } from "../middlewares/auth.js";
import { categoryProduct, deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getLatestProducts, getSingleProducts, newProduct, updateProduct } from "../controllers/product.controller.js";
import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();

// create new products - /api/v1/product/
app.post("/new" , singleUpload,  newProduct)
app.get("/latest",getLatestProducts)

app.get("/all",getAllProducts)

app.get("/categories",getAllCategories)
app.get("/admin-products",adminOnly,getAdminProducts)
app.get("/:category",categoryProduct)

app.route("/:id").get(getSingleProducts).put(adminOnly,singleUpload,updateProduct).delete( adminOnly,deleteProduct)

export  default app;