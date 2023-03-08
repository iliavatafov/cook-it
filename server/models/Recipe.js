const { model, Schema } = require("mongoose");

const recipeSchema = new Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    recipeImage: {
      type: Buffer,
      default: null,
    },
    cookingTime: {
      hours: { type: Number, required: [true, "The hours field is required"] },
      minutes: {
        type: Number,
        required: [true, "The minutes field is required"],
      },
    },
    ingredients: {
      type: [String],
      required: [true, "Ingredients are required"],
      validate: [arrayMinLength, "At least one ingredient is required"],
    },
    steps: {
      type: [
        {
          image: {
            type: Buffer,
            default: null,
          },
          description: {
            type: String,
            required: [true, "Description is required"],
          },
        },
      ],
      required: [true, "Steps are required"],
      validate: [arrayMinLength, "At least one step is required"],
    },
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: [true, "Comment text is required"] },
        createdAt: { type: Date, default: Date.now },
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
      },
    ],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

function arrayMinLength(val) {
  return val.length >= 1;
}

recipeSchema.virtual("likesCount").get(function () {
  return `${this.likes.length}`;
});

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;
