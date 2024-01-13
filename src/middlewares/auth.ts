import { User } from "../models/user.model.js";
import Errorhandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

export const adminOnly = TryCatch(async (req, res, next) => {

  const { id } = req.query; // Read id from query parameters

  if (!id) {
    return next(new Errorhandler("Login first!", 401));
  }

  const user = await User.findById(id);

  if (!user) {
    return next(new Errorhandler("Id is not valid", 401));
  } 

  if (user.role !== "admin") {
    return next(new Errorhandler("You are not admin", 401));
  }

  next();
});

  
// parmas are /v1/uaer/3343dsd == id
// query  are /v1/uaer/3343dsd?key=24  == key after id is query to acces tis object
