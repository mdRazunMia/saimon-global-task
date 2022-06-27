const mongoose = require("mongoose");
var Float = require("mongoose-float").loadType(mongoose);
const PackageSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title name is required.| unique"],
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
    },
    startingPrice: {
      type: Float,
      required: true,
    },
    duration: {
      type: Float,
      required: true,
    },
    isMostPopular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    cityName: {
      type: String,
      required: [true, "City name is requried."],
    },
    plans: [
      {
        singlePerPax: {
          type: Float,
        },
        doublePerPax: {
          type: Float,
        },
        twinPerPax: {
          type: Float,
        },
        triplePerPax: {
          type: Float,
        },
        child7To12: {
          type: Float,
        },
        child3To6: {
          type: Float,
        },
        infant: {
          type: Float,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Package", PackageSchema);
