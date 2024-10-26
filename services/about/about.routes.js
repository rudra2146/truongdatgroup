const aboutController = require("./about.controller");
const express = require('express');
const upload = require('../../middlewares/upload')
const { authenticateAndAuthorize  } = require('../../middlewares/authMiddleware');
const router = express.Router();
router.use(express.urlencoded({ extended: true }))

router.post('/:languageCode', authenticateAndAuthorize('admin'), (req, res, next) => {
    console.log("Decoded user:", req.user); // Log the decoded user

    // Proceed to the next middleware
    next();
}, upload.fields([
    { name: 'visionMission[vision][image]', maxCount: 1 },
    { name: 'visionMission[mission][image]', maxCount: 1 },
    { name: 'directorsImg[image]', maxCount: 10 },
    { name: 'quality[en][image]', maxCount: 1 },
    { name: 'value[en][image]', maxCount: 1 },
    { name: 'trust[en][image]', maxCount: 1 }
]), (req, res, next) => {
    aboutController.createUpdateAbout(req, res, next);
});


router.get('/list', aboutController.listAbout);
module.exports = router;
