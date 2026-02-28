const db = require("../config/db");

/* ================================
   ADD MEAL
================================ */
const addMeal = (req, res) => {
  const { meal_name, meal_type, meal_date, calories, isVeg } = req.body;

  if (!meal_name || !meal_type || !meal_date) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const sql = `
    INSERT INTO planned_meals 
    (meal_name, meal_type, meal_date, calories, isVeg)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [meal_name, meal_type, meal_date, calories || 0, isVeg ?? false],
    (err, result) => {
      if (err) {
        console.error("Error inserting meal:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({
        id: result.insertId,
        meal_name,
        meal_type,
        meal_date,
        calories: calories || 0,
        isVeg: isVeg ?? false,
      });
    }
  );
};

/* ================================
   GET MEALS BY DATE
   ✅ FIXED: Returns YYYY-MM-DD only
================================ */
const getMealsByDate = (req, res) => {
  const { date } = req.params;

  const sql = `
    SELECT 
      id,
      meal_name,
      meal_type,
      DATE(meal_date) AS meal_date, -- remove time
      calories,
      isVeg
    FROM planned_meals
    WHERE DATE(meal_date) = ?
    ORDER BY id DESC
  `;

  db.query(sql, [date], (err, results) => {
    if (err) {
      console.error("Error fetching meals:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(results);
  });
};

/* ================================
   DELETE MEAL
================================ */
const deleteMeal = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM planned_meals WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting meal:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.status(200).json({ message: "Meal deleted successfully 🗑️" });
  });
};

/* ================================
   UPDATE MEAL
================================ */
const updateMeal = (req, res) => {
  const { id } = req.params;
  const { meal_name, meal_type, meal_date, calories, isVeg } = req.body;

  if (!meal_name || !meal_type || !meal_date) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const sql = `
    UPDATE planned_meals
    SET meal_name = ?, 
        meal_type = ?, 
        meal_date = ?, 
        calories = ?, 
        isVeg = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [meal_name, meal_type, meal_date, calories || 0, isVeg ?? false, id],
    (err, result) => {
      if (err) {
        console.error("Error updating meal:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Meal not found" });
      }

      res.status(200).json({
        id,
        meal_name,
        meal_type,
        meal_date,
        calories: calories || 0,
        isVeg: isVeg ?? false,
        message: "Meal updated successfully ✏️",
      });
    }
  );
};

/* ================================
   GET ALL MEALS
   Used for Insights/Analytics
================================ */
const getAllMeals = (req, res) => {
  const sql = `
    SELECT 
      id,
      meal_name,
      meal_type,
      DATE(meal_date) AS meal_date,
      calories,
      isVeg
    FROM planned_meals
    ORDER BY meal_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching all meals:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
};

module.exports = {
  addMeal,
  getMealsByDate,
  getAllMeals,
  deleteMeal,
  updateMeal,
};