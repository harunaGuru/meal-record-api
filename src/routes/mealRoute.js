const express = require("express");
const User = require("../models/userModel");
const { isAuthenticated, isAdmin, isUser } = require("../middleware/auth");
const Meal = require("../models/mealModel");
const fetch = require("node-fetch");
const path = require("path");
const userModel = require("../models/userModel");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const router = express.Router();
const NUTRITION_APPLICATIONID = process.env.NUTRITION_APPLICATIONID;
const NUTRITION_APPLICATIONKEY = process.env.NUTRITION_APPLICATIONKEY;

router.post("/create", isAuthenticated, isUser, async (req, res) => {
  try {
    const { mealname, calories } = req.body;
    if (Number.isNaN(calories)) {
      return res.status(400).json({
        err: "calories should be a number",
      });
    }
    const user = req.user.id;
    const foundUser = await User.findById(user);
    console.log("foundUser = ", foundUser);
    if (!foundUser) {
      return res.status(404).json({
        err: "User cannot be found",
      });
    }
    const existingMeal = await Meal.findOne({ mealname });
    if (existingMeal) {
      return res.status(403).json({
        err: "meal already exist",
      });
    }
    let newMeal = {};
    if (mealname && calories) {
      newMeal = {
        userId: user,
        mealname,
        calories,
      };
    } else if (mealname && !calories) {
      const api_url = `https://api.nutritionix.com/v1_1/search/${mealname}?results=0:20&fields=nf_calories&appId=${NUTRITION_APPLICATIONID}&appKey=${NUTRITION_APPLICATIONKEY}`;
      const fetch_response = await fetch(api_url, {
        method: "post",
        body: JSON.stringify(mealname),
        headers: { "Content-Type": "application/json" },
      });
      const json = await fetch_response.json();
      console.log(json);
      const result = json.hits[1];
      console.log(result);
      const calory = result.fields.nf_calories || 250;
      console.log(calory);

      newMeal = {
        userId: user,
        mealname,
        calories: calory,
      };
    }

    const createdMeal = new Meal(newMeal);
    await createdMeal.save();
    // foundUser.meal.push(newMeal);
    // await foundUser.save();
    res.status(201).json({
      message: "meal created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      err: error.message,
    });
  }
});

router.get("/getMeals", isAuthenticated, isUser, async (req, res) => {
  try {
    const user = req.user.id;
    const foudUser = await User.findById(user);
    if (!foudUser) {
      return res.status(404).json({
        err: "User cannot be found",
      });
    }

    let foundMeals
   
    if (foudUser.role === "Admin") {
      foundMeals = await Meal.find({});
    //   function (err, docs) {
    //     if (!err) { 
    //       console.log(docs);
    //       return docs
    //     //process.exit();
    //  }
    // else {
    //     throw err;
    // }
    //   }
    } else {
      foundMeals = await Meal.find({ userId: foudUser });
    }
     
    if (!foundMeals) {
      return res.status(404).json({ err: "You do not have a Meal Record" });
    }
    return res.status(200).json({ foundMeals });
  } catch (error) {
    return res.status(500).json({
      err: error.message,
    });
  }
});

router.put("/getMeal/:mealId", isAuthenticated, isUser, async (req, res) => {
  try {
    const user = req.user.id;
    const { mealname, calories } = req.body;
    const foudUser = await User.findById(user);
    if (!foudUser) {
      return res.status(404).json({
        err: "User cannot be found",
      });
    }
    let foundMeal;
    if (foudUser.role=== "Admin") {
      foundMeal = await Meal.findById(req.params.mealId);
    } else {
      foundMeal = await Meal.findOne(
        { _id: req.params.mealId, },
        {userId: foudUser }
      );
      console.log(foundMeal);

      // let UserMeal = await Meal.find({ userId: foudUser })
      // let paramet = req.params.mealId;
      // for (const meal of UserMeal) {
      //   if (meal.id === paramet) {
      //     console.log("userMeal =", meal._id);
      //     console.log("parms =", req.params.mealId);
      //      foundMeal = await Meal.findById(meal._id);
      //     console.log(foundMeal);
      //   }

      // }
    }

    if (!foundMeal) {
      return res.status(404).json({
        err: "Meal cannot be found",
      });
    }
    
    const updatedMeal = await Meal.updateOne(
      { _id: req.params.mealId },
      { mealname, calories }
    );
    res.status(200).json(updatedMeal);
  } catch (error) {
    return res.status(500).json({
      err: error.message,
    });
  }
});

module.exports = router;
