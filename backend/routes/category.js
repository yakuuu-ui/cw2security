const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const upload = require("../middleware/uploads"); // ✅ Ensure correct import

const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/category");


router.post("/createCategory", protect,upload.single("categoryImage"), createCategory);
router.get("/getCategories", getCategories);
router.get("/getCategory/:id", getCategory);
router.put("/updateCategory/:id", protect, upload.single("categoryImage"), updateCategory);
router.delete("/deleteCategory/:id", protect, deleteCategory);

module.exports = router;
