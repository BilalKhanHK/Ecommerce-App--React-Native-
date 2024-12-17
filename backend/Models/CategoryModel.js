import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
    },
  },
  { timestamps: true }
);

const CategoryModel = new mongoose.model("CategoryModel", CategorySchema);

export default CategoryModel;
