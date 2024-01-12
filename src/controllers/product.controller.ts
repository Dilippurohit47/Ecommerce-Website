import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  BaseQuery,
  SearchRequestQuery,
  newProductRequestBody,
} from "../types/types.js";
import { Product } from "../models/product.model.js";
import Errorhandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/feature.js";

// revalidate on New ,update ,Delete Product and in new order

export const getLatestProducts = TryCatch(async (req, res, next) => {
  let products;

  if (myCache.has("latest-products"))
  products = JSON.parse(myCache.get("latest-products") as string);
  else {
  products = await Product.find({}).sort({ createdAt: 1 }).limit(5);
  myCache.set("latest-products", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories;

  if (myCache.has("categories"))
    categories = JSON.parse(myCache.get("categories") as string);
  else {
    categories = await Product.distinct("category");
    myCache.set("categories", JSON.stringify(categories));
  }

  return res.status(201).json({
    success: true,
    categories,
  });
});

export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;
  // if(myCache.has("all-products")) products = JSON.parse(myCache.get("all-products") as string)

  // else{
  products = await Product.find({});
  // myCache.set("all-products",JSON.stringify(products))  }

  return res.status(201).json({
    success: true,
    products,
  });
});

export const getSingleProducts = TryCatch(async (req, res, next) => {
  let product;

  const id = req.params.id;

  if (myCache.has(`product-${id}`))
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  else {
    product = await Product.findById(id);

    myCache.set("all-products", JSON.stringify(product));
    if (!product) return next(new Errorhandler(" product not found  ", 404));

    myCache.set(`product-${id}`, JSON.stringify(product));
  }

  return res.status(201).json({
    success: true,
    product,
  });
});

export const newProduct = TryCatch(
  async (
    req: Request<{}, {}, newProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, price, stock, category } = req.body;

    const photo = req.file;

    if (!photo)
      return next(new Errorhandler("please upload image of product", 400));

    if (!price || !stock || !category || !name) {
      console.log(name, price, stock, category);

      rm(photo.path, () => {
        console.log("photo deleted");
      });

      return next(new Errorhandler("Please enter all fields", 401));
    }

    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo.path,
    });

 invalidateCache({ product: true, admin: true });

    return res.status(201).json({
      success: true,
      message: "Product created Successfully",
    });
  }
);

////update p
export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;
  const photo = req.file;
  const product = await Product.findById(id);

  if (!product) return next(new Errorhandler("Invalid  product id ", 404));

  if (photo) {
    rm(product.photo!, () => {
      console.log(" old photo deleted");
    });

    product.photo = photo.path;
  }

  if (name) product.name = name;

  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;
  if (name) product.name = name;

  await product.save();

invalidateCache({
    product: true,
    admin: true,

    productId: String(product._id),
  });

  return res.status(200).json({
    success: true,
    message: "Product updated Successfully",
    product,
  });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new Errorhandler("Product Not Found ", 404));

  rm(product.photo!, () => {
    console.log("photo deleted");
  });

  await product.deleteOne();
invalidateCache({ product: true, productId: String(product._id),
    admin: true
  });

  return res.status(201).json({
    success: true,
    message: "Product deleted successfully",
  });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;

    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };
    if (price)
      baseQuery.price = {
        $lte: Number(price), // lte = lessthan equal to
      };

    if (category) baseQuery.category = category;

    const productPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredProducts] = await Promise.all([
      productPromise,
      Product.find({ baseQuery }),
    ]);

    const totalPage = Math.ceil(filteredProducts.length / limit);

    return res.status(201).json({
      success: true,
      products,
      totalPage,
    });
  }
);
