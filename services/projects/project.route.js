const express = require("express");
const controller = require("./project.controller");
const upload = require('../../middlewares/upload');
const router = express.Router();
const { authenticateAndAuthorize } = require('../../middlewares/authMiddleware');

router.post('/update', 
    authenticateAndAuthorize('admin'), 
    upload.fields([
        { name: 'carouselImages', maxCount: 12 }, 
        { name: 'projectImage', maxCount: 1 }
    ]), 
    (req, res, next) => {
        console.log("Decoded user:", req.user); 
        next(); // Move to the next middleware
    }, 
    controller.createOrUpdateHome
);

router.get('/list', controller.list);

module.exports = router;
