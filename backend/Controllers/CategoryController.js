import CategoryModel from "../Models/CategoryModel.js";
import ProductModel from "../Models/ProductsModel.js";

//creating Category
export const createCategoryController = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({
        message: "Category is required",
        success: false,
      });
    }
    if (!req.user.isAdmin) {
      return res.status(403).json({
        message: "Only admin can create categories",
        success: false,
      });
    }
    const categoryExists = await CategoryModel.find({});
    // console.log(categoryExists);

    //check if category already exists (case insensitive)
    if (categoryExists.length > 0) {
      for (let index = 0; index < categoryExists.length; index++) {
        if (
          categoryExists[index].category.toLowerCase() ===
          category.toLowerCase()
        ) {
          return res.status(400).json({
            message: "Category already exists",
            success: false,
          });
        }
      }
    }

    const newCategory = new CategoryModel({ category });
    await newCategory.save();
    res.status(201).json({
      message: "Category created successfully",
      success: true,
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error in Creating Category Api.",
      success: false,
    });
    console.error(error);
  }
};

//getting all categories
export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await CategoryModel.find({});
    if (categories.length < 1) {
      return res.status(404).json({
        message: "No categories found",
        success: false,
      });
    }
    res.json({
      message: "Categories fetched successfully",
      totalCategories: categories.length,
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: "Error in Fetching Categories Api.",
      success: false,
    });
    console.error(error);
  }
};

//getting a single category
export const getSingleCategoryController = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
      });
    }
    res.json({
      message: "Category fetched successfully",
      success: true,
      data: category,
    });
  } catch (error) {
    //cast Error
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Product Id.",
      });
    }
    res.status(500).json({
      error,
      message: "Error in Fetching Category Api.",
      success: false,
    });
    console.error(error);
  }
};

//updating a category
export const updateCategoryController = async (req, res) => {
  try {
    if (!req.body.category) {
      return res.status(400).json({
        message: "Category must be provided to update it.",
        success: false,
      });
    }
    const category = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
      });
    }
    res.json({
      message: "Category updated successfully",
      success: true,
      data: category,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Product Id.",
      });
    }
    res.status(500).json({
      error,
      message: "Error in Updating Category Api.",
      success: false,
    });
    console.error(error);
  }
};

//deleting Category
export const deleteCategoryController = async (req, res) => {
  try {
    const isCategory = await CategoryModel.findById(req.params.id);
    if (!isCategory) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
      });
    }

    // find product with this id
    const product = await ProductModel.find({ category: isCategory._id });
    // console.log(product);
    if (product.length > 0) {
      for (let index = 0; index < product.length; index++) {
        // product[index].category = undefined;
        product[index].category = null;
        await product[index].save();
      }
    }

    let deletedCategory = await CategoryModel.findByIdAndDelete(req.params.id);
    res.json({
      message: "Category deleted successfully",
      success: true,
      deletedCategory,
    });
  } catch (error) {
    //cast error
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Category Id.",
      });
    }
    res.status(500).json({
      error,
      message: "Error in Deleting Category Api.",
      success: false,
    });
    console.error(error);
  }
};
