const Joi = require("@hapi/joi");

const inpoutValidation = (data) => {
  let schema = Joi.object({
    title: Joi.string().required().messages({
      "string.empty": `Title name cannot be an empty field`,
      "any.required": `Title is required.`,
    }),
    description: Joi.string().required().messages({
      "string.empty": `Description name cannot be an empty field`,
      "any.required": `Description is required.`,
    }),
    cityName: Joi.string().required().messages({
      "string.empty": `Description name cannot be an empty field`,
      "any.required": `Description is required.`,
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  inpoutValidation,
};
