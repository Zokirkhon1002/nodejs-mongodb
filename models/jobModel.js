const { Schema, model } = require("mongoose");
const Joi = require("joi");

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const JobModel = model("Job", jobSchema); // Capitalize the model name

function validateJob(body) {
  const schema = Joi.object({
    title: Joi.string().required().min(3).max(80),
  });
  return schema.validate(body);
}

module.exports = { JobModel, validateJob }; //
