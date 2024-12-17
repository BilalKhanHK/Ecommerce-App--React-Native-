import express from "express";
import {
  createProductController,
  deleteAllProductController,
  deleteProductController,
  deleteProductImageController,
  getAllProductsController,
  getProductByKeywordController,
  getProductOnIdController,
  getTopProductsController,
  updateProductController,
  updateProductImageController,
  updateReviewController,
} from "../Controllers/ProductsController.js";
import auth from "../middlewares/auth.js";
const productRouter = express.Router();
import { body, validationResult } from "express-validator";
import ExpressFormidable from "express-formidable";
import { singleUpload } from "../middlewares/multer.js";
import { isAdmin } from "../middlewares/isAdmin.js";

//getting All products Route
productRouter.get("/getAllProducts", getAllProductsController);

//getting product on Id
productRouter.get("/getProductOnId/:id", getProductOnIdController);

//create Product Route
productRouter.post(
  "/createProduct",
  singleUpload,
  [
    body("name").notEmpty().withMessage("Product Name is required"),
    body("price").notEmpty().withMessage("Pirce is required"),
    body(
      "description",
      "Description must be between 6 and 200 characters long"
    ).isLength({
      min: 6,
      max: 200,
    }),
    body("stock").notEmpty().withMessage("Stock is required"),
  ],
  auth,
  isAdmin,
  createProductController
);

//update product
productRouter.put("/updateProduct/:id", auth, isAdmin, updateProductController);

//update Product Image
productRouter.put(
  "/updateProductImage/:id",
  singleUpload,
  auth,
  isAdmin,
  updateProductImageController
);

//delete product image
productRouter.delete(
  "/deleteProductImage/:id",
  auth,
  isAdmin,
  deleteProductImageController
);

//delete Product
productRouter.delete(
  "/deleteProduct/:id",
  auth,
  isAdmin,
  deleteProductController
);

//delete All Products
productRouter.delete(
  "/deleteAllProducts",
  auth,
  isAdmin,
  deleteAllProductController
);

//product reviews
productRouter.put("/updateReviews/:id", auth, updateReviewController);

//get Product By Keyword
productRouter.get(
  "/getProductByKeyword/:keyword",
  auth,
  getProductByKeywordController
);

//getting top products
productRouter.get("/getTopProducts", auth, getTopProductsController);

export default productRouter;
