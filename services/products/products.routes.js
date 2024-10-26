const express = require("express");
const controller = require("./products.controller");
const router = express.Router();
const { authenticateAndAuthorize } = require('../../middlewares/authMiddleware');
/*
 *  Add
 */
router.post("/update", authenticateAndAuthorize('admin'), (req, res, next) => {
    console.log("Decoded user:", req.user); 
    next();
}, controller.manageProduct);

/*
 *  List All
 */
router.get("/list/:languageCode?", controller.list);
module.exports = router;
