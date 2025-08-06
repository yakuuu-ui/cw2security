const asyncHandler = require("../middleware/async");
const Subcategory = require("../models/subcategory");
const Category = require("../models/Category");
const mongoose = require("mongoose");


// @desc    Get all subcategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubcategories = asyncHandler(async (req, res, next) => {
    const subcategories = await Subcategory.find().populate("category", "name description");
    res.status(200).json({
        success: true,
        count: subcategories.length,
        data: subcategories,
    });
});

// @desc    Get single subcategory
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubcategory = asyncHandler(async (req, res, next) => {
    const subcategory = await Subcategory.findById(req.params.id).populate("category", "name description");
    if (!subcategory) {
        return res.status(404).json({ message: `Subcategory not found with id of ${req.params.id}` });
    }
    res.status(200).json({
        success: true,
        data: subcategory,
    });
});

// @desc    Create new subcategory
// @route   POST /api/v1/subcategories
// @access  Private (Admin)
exports.createSubcategory = asyncHandler(async (req, res, next) => {
    const { name, description, category } = req.body;

    // Check if the category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
        return res.status(400).json({ message: "Category not found" });
    }

    // Check if subcategory already exists under the same category
    const existingSubcategory = await Subcategory.findOne({ name, category });
    if (existingSubcategory) {
        return res.status(400).json({ message: "Subcategory already exists under this category" });
    }

    const subcategory = await Subcategory.create({
        name,
        description,
        category,
    });

    res.status(201).json({
        success: true,
        message: "Subcategory created successfully",
        data: subcategory,
    });
});

// @desc    Update subcategory
// @route   PUT /api/v1/subcategories/:id
// @access  Private (Admin)
exports.updateSubcategory = asyncHandler(async (req, res, next) => {
    let subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) {
        return res.status(404).json({ message: `Subcategory not found with id of ${req.params.id}` });
    }

    const { name, description, category } = req.body;

    // If category is provided, check if it exists
    if (category) {
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res.status(400).json({ message: "Category not found" });
        }
    }

    subcategory = await Subcategory.findByIdAndUpdate(
        req.params.id,
        { name, description, category },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: "Subcategory updated successfully",
        data: subcategory,
    });
});

// @desc    Get subcategories by category ID
// @route   GET /api/v1/subcategories/category/:categoryId
// @access  Public
exports.getSubcategoriesByCategoryId = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params;

    // Check if the category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
    }
    // Check if categoryId is valid
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ error: "Invalid category ID format" });
    }


    // Fetch subcategories linked to the given category ID
    const subcategories = await Subcategory.find({ category: categoryId });

    res.status(200).json({
        success: true,
        count: subcategories.length,
        data: subcategories,
    });
});

// @desc    Delete subcategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private (Admin)
exports.deleteSubcategory = asyncHandler(async (req, res, next) => {
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) {
        return res.status(404).json({ message: `Subcategory not found with id of ${req.params.id}` });
    }

    await subcategory.deleteOne();

    res.status(200).json({
        success: true,
        message: "Subcategory deleted successfully",
    });
});
