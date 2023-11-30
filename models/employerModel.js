const { Schema, model } = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const EmployerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    degree: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    job_id: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  { timestamps: true }
);

const EmployerModel = model("Employer", EmployerSchema);

function validateEmployer(body) {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(80),
    degree: Joi.string().required().min(3).max(80),
    salary: Joi.number().required().min(1),
    job_id: Joi.objectId().required(),
  });

  return schema.validate(body);
}

module.exports = {
  EmployerModel,
  validateEmployer,
};
