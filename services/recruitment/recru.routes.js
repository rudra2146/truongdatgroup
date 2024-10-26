const recruController = require("./recru.controller");
const express = require('express');
const bodyParser = require('body-parser');
const upload = require('../../middlewares/upload');
const router = express.Router();
const { authenticateAndAuthorize } = require('../../middlewares/authMiddleware');
router.use(express.urlencoded({ extended: true }));
router.use(bodyParser.json({ limit: '150mb' }));
router.use(bodyParser.urlencoded({ limit: '150mb', extended: true }));



// Define routes
router.post('/update', 
    authenticateAndAuthorize('admin'),  upload.fields([
    { name: 'careerImg', maxCount: 1 },
    { name: 'vision[image]' }
]),(req, res, next) => {
    console.log("Decoded user:", req.user); 
    next(); // Move to the next middleware
},  recruController.createUpdateRecru);

router.get('/list', recruController.list);
module.exports = router;
