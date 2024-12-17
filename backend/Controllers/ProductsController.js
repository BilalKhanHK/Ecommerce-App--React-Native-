import ProductModel from "../Models/ProductsModel.js";
import { body, validationResult } from "express-validator";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";
import OrderModel from "../Models/OrderModel.js";
import CategoryModel from "../Models/CategoryModel.js";

//getting all products
export const getAllProductsController = async (req, res) => {
  try {
    const products = await ProductModel.find({}).populate("category");

    res.json({
      success: true,
      products,
      message: "All Products Fetched Successfully.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "Error in Getting All Products Api." });
    console.error(error);
  }
};

//getting Product on id
export const getProductOnIdController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found.",
      });
    }
    res.json({
      success: true,
      product,
      message: "Product Fetched Successfully.",
    });
  } catch (error) {
    //cast Error
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Product Id.",
      });
    }
    res
      .status(500)
      .json({ error, message: "Error in Getting getting Product on Id Api." });
    console.error(error);
  }
};

//creating new product
export const createProductController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    let { name, price, description, category, stock } = req.body;
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No Image Provided." });
    }

    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    // console.log("This is req.body", cdb);
    await ProductModel.create({
      name,
      price,
      description,
      category,
      stock,
      images: [image],
      createdBy: req.user._id,
    });
    res.status(201).json({
      success: true,
      message: "Product Created Successfully.",
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
      success: false,
      error,
      message: "Error in Creating Product Api.",
    });
    console.error(error);
  }
};

//update Product
export const updateProductController = async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found.",
      });
    }
    res.json({
      success: true,
      product,
      message: "Product Updated Successfully.",
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
      success: false,
      error,
      message: "Error in Updating Product Api.",
    });
    console.error(error);
  }
};

//update Product Image
export const updateProductImageController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    //check Product
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found.",
      });
    }
    //check file
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No Image Provided." });
    }

    //file get from client photo
    const file = getDataUri(req.file);

    //update
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    product.images.push(image);
    await product.save();
    res.json({
      success: true,
      product,
      message: "Product Image Updated Successfully.",
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
      success: false,
      error,
      message: "Error in Updating Product Image Api.",
    });
    console.error(error);
  }
};

//deleting product image
export const deleteProductImageController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    //check Product
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found.",
      });
    }

    //image id found
    const id = req.query.id;
    // console.log(id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product image not found",
      });
    }

    //To find the index of array in which index we want to  delete image
    let isExist = -1;
    product.images.forEach((item, index) => {
      if (item._id.toString() === id.toString()) {
        isExist = index;
      }
      if (isExist < 0) {
        return res.status(400).json({
          success: false,
          message: "Product image not found",
        });
      }
    });

    //delete Product Image from cloudinary
    await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);

    //delete Product Image from database
    product.images.splice(isExist, 1);
    await product.save();

    res.json({
      success: true,
      product,
      message: "Product Image Deleted Successfully.",
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
      success: false,
      error,
      message: "Error in deleting Product Image Api.",
    });
    console.error(error);
  }
};

//deleting product
export const deleteProductController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found.",
      });
    }

    //delete Product Images from cloudinary
    for (let index = 0; index < product.images.length; index++) {
      await cloudinary.v2.uploader.destroy(product.images[index].public_id);
    }
    await ProductModel.deleteOne({ _id: product._id });

    res.json({
      success: true,
      message: "Product Deleted Successfully.",
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
      success: false,
      error,
      message: "Error in Deleting Product Api.",
    });
    console.error(error);
  }
};

//deleting All Products
export const deleteAllProductController = async (req, res) => {
  try {
    let allProducts = await ProductModel.find({});
    // console.log(allProducts);

    //delete All Product images from Cloudinary
    for (let i = 0; i < allProducts.length; i++) {
      for (let j = 0; j < allProducts[i].images.length; j++) {
        await cloudinary.v2.uploader.destroy(
          allProducts[i].images[j].public_id
        );
      }
    }

    //deleting all order
    let allDeletedOrders = await OrderModel.deleteMany({
      orderStatus: "processing",
    });

    //delete all Products from Database
    let allDeletedProducts = await ProductModel.deleteMany({});

    res.json({
      success: true,
      totalDeletedProducts: allDeletedProducts.length,
      totalDeletedOrders: allDeletedOrders.length,
      allDeletedProducts,
      message: "All Products Deleted Successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
      message: "Error in Deleting All Products Api.",
    });
    console.error(error);
  }
};

//updating reviews
export const updateReviewController = async (req, res) => {
  try {
    const { comment, rating } = req.body;

    //finding the product
    const product = await ProductModel.findById(req.params.id);

    //find the user if he already give reviews
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    const review = {
      name: req.user.name,
      user: req.user._id,
      comment,
      rating,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    if (rating === undefined) {
      //we pick the reviews in which user give rating
      const ratingNotZero = product.reviews.filter((r) => r.rating !== 0);

      product.averageRating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        ratingNotZero.length;
    } else {
      //we pick the reviews in which user does not give rating
      const ratingZero = product.reviews.filter((r) => r.rating === 0);

      //take the lenght of the users which give rating more than 0
      const totalLength = Number(product.reviews.length - ratingZero.length);
      product.averageRating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        totalLength;
    }

    //saving reviews
    await product.save();

    res.status(200).send({
      success: true,
      message: "Review Added successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
      message: "Error in updating Products review Api.",
    });
    console.error(error);
  }
};

//getting Products by Keywords
export const getProductByKeywordController = async (req, res) => {
  try {
    let { keyword } = req.params;
    const Product = await ProductModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    })
      .select("-reviews")
      .populate("category");
    if (Product.length < 1) {
      return res.status(404).json({
        success: false,
        message: "No product found with this keyword.",
      });
    }
    res.status(200).json({
      success: true,
      total: Product.length,
      Product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
      message: "Error in Getting Product by Keyword Api.",
    });
    console.error(error);
  }
};

//getting Top products
export const getTopProductsController = async (req, res) => {
  try {
    const Product = await ProductModel.find({})
      .sort({ averageRating: -1 })
      .limit(5)
      .select("-reviews");
    if (Product.length < 1) {
      return res.status(404).json({
        success: false,
        message: "No product found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Top Products Fetched Successfully",
      total: Product.length,
      Product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
      message: "Error in Getting Top Product Api.",
    });
    console.error(error);
  }
};
