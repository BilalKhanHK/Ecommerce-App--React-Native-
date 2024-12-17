import express from "express";
import auth from "../middlewares/auth.js";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getSingleCategoryController,
  updateCategoryController,
} from "../Controllers/CategoryController.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const categoryRoutes = express.Router();

//create category routes
categoryRoutes.post("/createCategory", auth, isAdmin, createCategoryController);

//get All Categories
categoryRoutes.get("/getAllCategories", auth, getAllCategoriesController);

//get Single category
categoryRoutes.get("/getSingleCategory/:id", auth, getSingleCategoryController);

//update Category Route
categoryRoutes.put(
  "/updateCategory/:id",
  auth,
  isAdmin,
  updateCategoryController
);

//delete category Route
categoryRoutes.delete(
  "/deleteCategory/:id",
  auth,
  isAdmin,
  deleteCategoryController
);

export default categoryRoutes;
