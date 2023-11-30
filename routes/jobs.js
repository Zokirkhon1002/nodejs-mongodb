const { Router } = require("express");
const router = Router();
// import middleware for auth

// jobs routes
const jobController = require("../controller/jobController");
router.get("/", jobController.getAll);
router.get("/:id", jobController.getOneById);
router.post("/add", jobController.createNew);
router.patch("/:id", jobController.updateById);
router.delete("/:id", jobController.deleteById);

module.exports = router;
