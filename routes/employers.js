const { Router } = require("express");
const router = Router();
// import middleware for auth

// employers routes
const employerController = require("../controller/employerController");
router.get("/", employerController.getAll);
router.get("/:id", employerController.getOneById);
router.post("/add", employerController.createNew);
router.patch("/:id", employerController.updateById);
router.delete("/:id", employerController.deleteById);

module.exports = router;
