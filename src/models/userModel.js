const Mongoose = require("mongoose");
const userSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    meal: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Meal",
      },
    ],
  },
  { timestamps: true }
);

module.exports = Mongoose.model("User", userSchema);
