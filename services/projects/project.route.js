const express = require("express");
const controller = require("./project.controller");
const upload = require('../../middlewares/upload');
const router = express.Router();

router.post('/update', upload.fields([
    { name: 'carouselImages' }, 
    { name: 'projectImage', maxCount: 1 }
]), controller.createOrUpdateHome);

router.get('/list', controller.list);

module.exports = router;
