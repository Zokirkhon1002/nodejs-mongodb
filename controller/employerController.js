const { JobModel } = require("../models/jobModel");
const { EmployerModel, validateEmployer } = require("../models/employerModel");
const { handleErrorResponse500, returnResult, errorResponse400 } = require("../common/returns");
const { objectReturner400Res } = require("../helpers/objectReturner");

class EmployerController {
  async getAll(req, res) {
    try {
      const employers = await EmployerModel.find().select("-__v");
      res.status(200).json(returnResult(true, "success", employers));
    } catch (error) {
      handleErrorResponse500(res, error);
    }
  }
  async getOneById(req, res) {
    try {
      const { id } = req.params;
      if (id?.length !== 24) {
        return errorResponse400(res, objectReturner400Res("ID is not correct"));
      }

      const oneEmployerById = await EmployerModel.findById(id)
        .populate({ path: "job_id", select: "-__v" })
        .select("-__v");

      if (!oneEmployerById) {
        return res.status(200).json(returnResult(false, "not found any data", null));
      }
      res.status(200).json(returnResult(true, "success", oneEmployerById));
    } catch (error) {
      handleErrorResponse500(res, error);
    }
  }
  async createNew(req, res) {
    try {
      const { error } = validateEmployer(req.body);
      if (error) {
        return errorResponse400(res, error);
      }
      // Check if the provided job_id exists in the JobModel collection
      const isValidJobId = await JobModel.exists({ _id: req.body.job_id });

      if (!isValidJobId) {
        return res.status(400).json(returnResult(false, "Invalid job_id provided", null));
      }

      const newJob = await EmployerModel.create(req.body);

      res.status(201).json(returnResult(true, "successfully created", newJob));
    } catch (error) {
      handleErrorResponse500(res, error);
    }
  }
  async updateById(req, res) {
    try {
      const { id } = req.params;
      if (id?.length !== 24) {
        return errorResponse400(res, objectReturner400Res("ID is not correct"));
      }

      if (req.body?.job_id) {
        const isValidJobId = await JobModel.exists({ _id: req.body.job_id });

        if (!isValidJobId) {
          return res.status(400).json(returnResult(false, "Invalid job_id provided", null));
        }
      }
      // Update the employer document by ID
      const updatedEmployer = await EmployerModel.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      if (!updatedEmployer) {
        return res.status(404).json(returnResult(false, "Employer not found", null));
      }
      res.status(200).json(returnResult(true, "Successfully updated", updatedEmployer));
    } catch (error) {
      handleErrorResponse500(res, error);
    }
  }
  async deleteById(req, res) {
    try {
      const { id } = req.params;
      if (id?.length !== 24) {
        return errorResponse400(res, objectReturner400Res("ID is not correct"));
      }

      // Check if the employer document exists before attempting to delete
      const existingEmployer = await EmployerModel.findById(id);
      if (!existingEmployer) {
        return res.status(404).json(returnResult(false, "Employer not found", null));
      }

      // Delete the employer document by ID
      await EmployerModel.findByIdAndDelete(id);

      res.status(200).json(returnResult(true, "Successfully deleted", existingEmployer));
    } catch (error) {
      handleErrorResponse500(res, error);
    }
  }
}

module.exports = new EmployerController();
