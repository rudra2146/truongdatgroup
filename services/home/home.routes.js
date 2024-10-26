const homeController = require("./home.controller");
const express = require('express');
const upload = require('../../middlewares/upload');
const { authenticateAndAuthorize  } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.post('/:languageCode',authenticateAndAuthorize('admin'), (req, res, next) => {
    console.log("Decoded user:", req.user); 
    next();
}, upload.fields([
    { name: 'homeAboutSection[yearImg]', maxCount: 1 },
    { name: 'homeAboutSection[img]', maxCount: 1 },
    { name: 'homeCarouselSection[carouselImg]', maxCount: 5 }
]), homeController.createHome);

router.get('/list', homeController.listHome);
module.exports = router;
