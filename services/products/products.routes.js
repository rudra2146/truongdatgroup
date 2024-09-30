const express = require("express");
const controller = require("./products.controller");
const router = express.Router();
/*
 *  Add
 */
router.post("/create", controller.create);

/*
 *  Get By Id
 */
router.get("/get/:id", controller.get);

/*
 *  List All
 */
router.get("/list", controller.list);

/*
 *  Update
 */
router.put("/update/:id", controller.update);

/*
 *  Delete
 */
router.delete("/delete/:id", controller.delete);

module.exports = router;
