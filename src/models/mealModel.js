const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const mealSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    mealname: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Mongoose.model("Meal", mealSchema);