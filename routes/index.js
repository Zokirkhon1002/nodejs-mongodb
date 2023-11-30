const { Router } = require("express");
const jobsRouter = require("./jobs");
const employersRouter = require("./employers");

const router = Router();

router.use("/jobs", jobsRouter);
router.use("/employers", employersRouter);

module.exports = router;
