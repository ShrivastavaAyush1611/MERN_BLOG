import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required."],
    unique: true,
trim: true,
  },
  slug: {
    type: String,
    required: [true, "Category slug is required."],
    unique: true,
trim: true,
  },
});

const Category = mongoose.model("Category", CategorySchema);

export default Category;