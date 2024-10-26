const aboutController = require("./about.controller");
const express = require('express');
const upload = require('../../middlewares/upload')
const router = express.Router();
router.use(express.urlencoded({ extended: true }))

router.post('/:languageCode', upload.fields([
    { name: 'visionMission[vision][image]', maxCount: 1 },
    { name: 'visionMission[mission][image]', maxCount: 1 },
    { name: 'directorsImg[image]', maxCount: 10 },
    { name: 'quality[en][image]', maxCount: 1 },
    { name: 'value[en][image]', maxCount: 1 },
    { name: 'trust[en][image]', maxCount: 1 }
]), (req, res, next) => {
    // Log after multer has processed the files
    console.log("Incoming Request Body:", req.body);  // Check that req.body contains the data
    console.log("Incoming Request Files:", req.files);  // Check the uploaded files

    // Call your controller after logging
    aboutController.createUpdateAbout(req, res, next);
});


router.get('/list', aboutController.listAbout);
// router.get('/:languageCode', aboutController.getHome);
// router.delete('/:id', homeController.deleteHome);

module.exports = router;
