const express = require("express");
const router = express.Router();
const {
  addMeal,
  getMealsByDate,
  getAllMeals,
  deleteMeal,
  updateMeal,
} = require("../controllers/mealController");

router.post("/", addMeal);
router.get("/all", getAllMeals);
router.get("/date/:date", getMealsByDate);
router.put("/:id", updateMeal);
router.delete("/:id", deleteMeal);

module.exports = router;