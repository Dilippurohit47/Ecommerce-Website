import { stringify } from "querystring";
import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/orders.model.js";
import { Product } from "../models/product.model.js";
import { NewOrderRequestBody } from "../types/types.js";
import { invalidateCache, reduceStock } from "../utils/feature.js";
import Errorhandler from "../utils/utility-class.js";

export const myOrder = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;
  let orders = [];
  const key = `myOrder-${user}`;

  if (myCache.has(key)) orders = JSON.parse(myCache.get(key) as string);
  else {
    orders = await Order.find({ user });

    myCache.set(key, JSON.stringify(orders));
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});

export const allorder = TryCatch(async (req, res, next) => {
  const key = `all-orders`;

  let orders = [];

  if (myCache.has(key)) orders = JSON.parse(myCache.get(key) as string);
  else {
    orders = await Order.find().populate("user", "name");

    myCache.set(key, JSON.stringify(orders));
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});

export const getSingleOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const key = `orders-${id}`;

  let order;

  if (myCache.has(key)) order = JSON.parse(myCache.get(key) as string);
  else {
    order = await Order.findById(id).populate("user", "name");

    if (!order) return next(new Errorhandler(" Order not found", 404));
    myCache.set(key, JSON.stringify(order));
  }

  return res.status(200).json({
    success: true,
    order,
  });
});

export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      shippingCharges,
      discount,
      total,
      tax,
    } = req.body;

    if (!shippingInfo || !orderItems || !user || !subtotal || !total || !tax)
      return next(new Errorhandler("Please Enter all  the fields", 400));

    const order = await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      shippingCharges,
      discount,
      total,
      tax,
    });

    await reduceStock(orderItems);

    const temp = order.orderItems.map((i) => String(i.productId));

     invalidateCache({
      product: true,
      order: true,
      admin: true,
      userId: user,
      productId: temp,
    });

    return res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
    });
  }
);

export const processOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) return next(new Errorhandler("Order Not Found", 404));

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";

      break;
    case "Shipped":
      order.status = "Delivered";

    default:
      order.status = "Delivered";
      break;
  }

  await order.save();

   invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res.status(200).json({
    success: true,
    message: "Order Processed Successfully",
  });
});

export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) return next(new Errorhandler("Order Not Found", 404));

  await order.deleteOne();

   invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });
  return res.status(200).json({
    success: true,
    message: "Order Deleted Successfully",
  });
});
