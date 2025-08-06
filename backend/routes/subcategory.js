const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
    createSubcategory,
    getSubcategories,
    getSubcategory,
    updateSubcategory,
    deleteSubcategory,
    getSubcategoriesByCategoryId
} = require("../controllers/subcategory");


router.post("/createSubcategory", createSubcategory);
router.get("/getSubcategories", getSubcategories);
router.get("/getSubcategory/:id", getSubcategory);
router.put("/updateSubcategory/:id", updateSubcategory);
router.delete("/deleteSubcategory/:id", deleteSubcategory);
router.get("/getSubcategoriesByCategoryId/:categoryId", getSubcategoriesByCategoryId);

module.exports = router;
