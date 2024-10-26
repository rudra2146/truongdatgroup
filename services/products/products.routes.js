const express = require("express");
const controller = require("./products.controller");
const router = express.Router();
/*
 *  Add
 */
router.post("/update", controller.manageProduct);

/*
 *  Get By Id
 */
router.get("/get/:id", controller.get);
    
/*
 *  List All
 */
router.get("/list/:languageCode?", controller.list);

/*
 *  Delete
 */
router.delete("/delete/:id", controller.delete);

module.exports = router;
