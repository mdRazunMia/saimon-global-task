const Package = require("../models/package_model");
const redisInstance = require("../redis/redis");
const validator = require("../validations/validations");

//Create a package

const createPackage = async (req, res) => {
  const { error, value } = validator.inpoutValidation({
    title: req.body.title,
    description: req.body.description,
    cityName: req.body.cityName,
  });

  if (error) {
    const errors = [];
    error.details.forEach((detail) => {
      const currentMessage = detail.message;
      detail.path.forEach((value) => {
        errors.push({ [value]: currentMessage });
      });
    });
    // res.status(422).send({ message: error.details[0].message });
    return res.status(422).send(errors);
  } else {
    const package = new Package(req.body);
    try {
      const savePackage = await package.save();
      if (!savePackage) {
        return res.status(204).send({
          errorMessage: "Something went wrong. Package does not created.",
        });
      } else {
        return res.status(201).send({
          package: savePackage,
          message: "Package has been created successfully.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

//without Redis
// const getPackages = async (req, res) => {
//   try {
//     if (Object.keys(req.query).length !== 0) {
//       console.log("inside query block");
//       var queryParamsArray = [];
//       if (req.query.title) {
//         console.log("inside title");
//         queryParamsArray.push({ title: new RegExp(req.query.title, "i") });
//       }

//       if (req.query.description) {
//         console.log("inside description");
//         queryParamsArray.push({
//           description: new RegExp(req.query.description, "i"),
//         });
//       }

//       if (req.query.cityName) {
//         console.log("inside city name");
//         queryParamsArray.push({
//           cityName: new RegExp(req.query.cityName, "i"),
//         });
//       }

//       if (req.query.startingPrice) {
//         queryParamsArray.push({
//           startingPrice: parseFloat(req.query.startingPrice),
//         });
//       }

//       if (req.query.duration) {
//         queryParamsArray.push({ duration: parseFloat(req.query.duration) });
//       }

//       if (req.query.isActive) {
//         var isTrueSet = req.query.isActive === "true";
//         queryParamsArray.push({ isActive: isTrueSet });
//       }

//       if (req.query.isMostPopular) {
//         var isTrueSet = req.query.isMostPopular === "true";
//         queryParamsArray.push({ isMostPopular: isTrueSet });
//       }

//       const allPackages = await Package.find({
//         $and: queryParamsArray,
//       });
//       if (allPackages.length === 0) {
//         return res.status(404).send({
//           errorMessage: "There is no package.",
//         });
//       } else {
//         return res.status(200).send({
//           packages: allPackages,
//         });
//       }
//     }

//     const allPackages = await Package.find();
//     if (allPackages.length === 0) {
//       return res.status(404).send({
//         errorMessage: "There is no package.",
//       });
//     } else {
//       return res.status(200).send({
//         packages: allPackages,
//       });
//     }
//   } catch (error) {
//     res.status(500).send({ errorMessage: "Internal server error." });
//   }
// };

//with redis
const getPackages = async (req, res) => {
  var redisClient = redisInstance.getRedisClient();

  try {
    if (Object.keys(req.query).length !== 0) {
      var queryParamsArray = [];
      if (req.query.title) {
        queryParamsArray.push({ title: new RegExp(req.query.title, "i") });
      }

      if (req.query.description) {
        queryParamsArray.push({
          description: new RegExp(req.query.description, "i"),
        });
      }

      if (req.query.cityName) {
        queryParamsArray.push({
          cityName: new RegExp(req.query.cityName, "i"),
        });
      }

      if (req.query.startingPrice) {
        queryParamsArray.push({
          startingPrice: parseFloat(req.query.startingPrice),
        });
      }

      if (req.query.duration) {
        queryParamsArray.push({ duration: parseFloat(req.query.duration) });
      }

      if (req.query.isActive) {
        var isTrueSet = req.query.isActive === "true";
        queryParamsArray.push({ isActive: isTrueSet });
      }

      if (req.query.isMostPopular) {
        var isTrueSet = req.query.isMostPopular === "true";
        queryParamsArray.push({ isMostPopular: isTrueSet });
      }
      // const queryData = await redisClient.get("queryData");
      // if (queryData === null) {
      const allPackages = await Package.find({
        $and: queryParamsArray,
      });

      if (allPackages.length === 0) {
        return res.status(404).send({
          errorMessage: "There is no package.",
        });
      } else {
        // redisClient.set("queryData", JSON.stringify(allPackages), {
        //   EX: Number(process.env.REDIS_EXP_TIME),
        // });
        return res.status(200).send({
          packages: allPackages,
        });
      }
      // } else {
      //   return res.status(200).send({ packages: JSON.parse(queryData) });
      // }
    }

    const data = await redisClient.get("packages");
    if (data === null) {
      const allPackages = await Package.find();
      if (allPackages.length === 0) {
        return res.status(404).send({
          errorMessage: "There is no package.",
        });
      } else {
        redisClient.set("packages", JSON.stringify(allPackages), {
          EX: Number(process.env.REDIS_EXP_TIME),
        });
        return res.status(200).send({
          packages: allPackages,
        });
      }
    } else {
      return res.status(200).send({ packages: JSON.parse(data) });
    }
  } catch (error) {
    res.status(500).send({ errorMessage: "Internal server error." });
    console.log(error);
  }
};

//get a single package by ID

const singlePackage = async (req, res) => {
  const id = req.params.id;
  try {
    const package = await Package.findById(id);
    if (!package) {
      return res.status(204).send({
        errorMessage: "There is no package.",
      });
    } else {
      return res.status(201).send({
        package: package,
      });
    }
  } catch (error) {
    res.status(500).send({ errorMessage: "Internal server error." });
    console.log(error);
  }
};

//update a package

const updatePackage = async (req, res) => {
  const id = req.params.id;

  const { error, value } = validator.inpoutValidation({
    title: req.body.title,
    description: req.body.description,
    cityName: req.body.cityName,
  });

  if (error) {
    const errors = [];
    error.details.forEach((detail) => {
      const currentMessage = detail.message;
      detail.path.forEach((value) => {
        errors.push({ [value]: currentMessage });
      });
    });
    return res.status(422).send(errors);
  } else {
    try {
      const updatedPackage = await Package.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedPackage) {
        return res.status(204).send({
          errorMessage: "There is no package.",
        });
      } else {
        return res.status(201).send({
          package: updatedPackage,
          message: "Package has been updated successfully.",
        });
      }
    } catch (error) {
      res.status(500).send({ errorMessage: "Internal server error." });
    }
  }
};

//delete a package

const deletePackage = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedPackage = await Package.findByIdAndDelete(id);
    if (!deletedPackage) {
      return res.status(204).send({
        errorMessage: "Package has not been deleted.",
      });
    } else {
      return res.status(201).send({
        message: "Package has been deleted successfully.",
      });
    }
  } catch (error) {
    res.status(500).send({ errorMessage: "Internal server error." });
  }
};

//add plans to the package

const addPlanToThePackage = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedPackage = await Package.findByIdAndUpdate(id, {
      $push: { plans: req.body },
    });
    if (!updatedPackage) {
      return res.status(204).send({
        errorMessage: "Something went wrong. Plan is not added in the package.",
      });
    } else {
      return res.status(201).send({
        package: updatedPackage,
        message: "Plan has been added successfully in the Package.",
      });
    }
  } catch (error) {
    res.status(500).send({ errorMessage: "Internal server error." });
  }
};

module.exports = {
  createPackage,
  getPackages,
  deletePackage,
  singlePackage,
  updatePackage,
  addPlanToThePackage,
};
