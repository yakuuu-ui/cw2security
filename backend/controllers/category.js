const asyncHandler = require("../middleware/async");
const Category = require("../models/Category");

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
    const categories = await Category.find();
    res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
    });
});

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(404).json({ message: `Category not found with id of ${req.params.id}` });
    }
    res.status(200).json({
        success: true,
        data: category,
    });
});

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private (Admin)
exports.createCategory = asyncHandler(async (req, res, next) => {
    const { name, description } = req.body;
    const image = req.file ? req.file.filename : null; // Get uploaded file

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
        return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
        name,
        description,
        image, // Save image filename in DB
    });

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
    });
});

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private (Admin)
exports.updateCategory = asyncHandler(async (req, res, next) => {
    let category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(404).json({ message: `Category not found with id of ${req.params.id}` });
    }

    const { name, description } = req.body;
    const image = req.file ? req.file.filename : category.image; // Keep old image if no new image is uploaded

    category = await Category.findByIdAndUpdate(
        req.params.id,
        { name, description, image },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category,
    });
});


// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private (Admin)
exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(404).json({ message: `Category not found with id of ${req.params.id}` });
    }

    await category.deleteOne();

    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
    });
});
