const { JobModel, validateJob } = require("../models/jobModel");
const { EmployerModel } = require("../models/employerModel");
const { handleErrorResponse500, returnResult, errorResponse400 } = require("../common/returns");
const { objectReturner400Res } = require("../helpers/objectReturner");

class JobController {
  // DESC: Get all jobs
  async getAll(req, res) {
    try {
      const jobs = await JobModel.find().select("-__v"); // .sort({ _id: -1 }) descending
      res.status(200).json(returnResult(true, "success", jobs));
    } catch (error) {
      handleErrorResponse500(res, error);
    }
  }

  // DESC: Get one job by id
  async getOneById(req, res) {
    try {
      const { id } = req.params;
      if (id?.length !== 24) {
        return errorResponse400(res, objectReturner400Res("ID is not correct"));
      }

      const oneJobById = await JobModel.findById(id).select("-__v");

      if (!oneJobById) {
        return res.status(200).json(returnResult(false, "not found any data", null));
      }
      res.status(200).json(returnResult(true, "success", oneJobById));
    } catch (error) {
      handleErrorResponse500(res, error);
    }
  }

  // DESC: Create a new job
  // REQUIRED: [title:string] in body
  async createNew(req, res) {
    try {
      const { error } = validateJob(req.body);
      if (error) {
        return errorResponse400(res, error);
      }
      const newJob = await JobModel.create(req.body);

      res.status(201).json(returnResult(true, "successfully created", newJob));
    } catch (error) {
      handleErrorResponse500(res, error);
    }
  }

  // DESC: Update a job by id
  async updateById(req, res) {
    try {
      const { id } = req.params;
      if (id?.length !== 24) {
        return errorResponse400(res, objectReturner400Res("ID is not correct"));
      }

      const { error } = validateJob(req.body);
      if (error) {
        return errorResponse400(res, error);
      }

      const updatedJob = await JobModel.findByIdAndUpdate(id, { $set: req.body }, { new: true });

      if (!updatedJob) {
        return res.status(404).json(returnResult(false, "Job not found", null));
      }

      res.status(200).json(returnResult(true, "successfully updated", updatedJob));
    } catch (error) {
      handleErrorResponse500(res, error);
    }
  }

  // DESC: Delete a job by id
  async deleteById(req, res) {
    try {
      const { id } = req.params;
      if (id?.length !== 24) {
        return errorResponse400(res, objectReturner400Res("ID is not correct"));
      }

      // Check if the job is referenced in EmployerModel
      const isJobReferenced = await EmployerModel.exists({ job_id: id });

      // If the job is referenced, ask for confirmation
      if (isJobReferenced) {
        const confirmation = req.body.confirmation; // Assuming you pass confirmation as a boolean in the request body

        if (!confirmation) {
          return res
            .status(200)
            .json(returnResult(false, "Job is referenced by employers. Deletion canceled.", null));
        }

        // If confirmation is true, delete the job and connected employers
        await EmployerModel.deleteMany({ job_id: id });
      }

      const deletedJob = await JobModel.findByIdAndDelete(id);

      if (!deletedJob) {
        res.status(403).json({
          state: false,
          msg: "There is a problem with deleting data",
          data: null,
        });
      }

      res.status(200).json(returnResult(true, "successfully deleted", deletedJob));
    } catch (error) {
      handleErrorResponse500(res, error);
    }
  }
}

module.exports = new JobController();
