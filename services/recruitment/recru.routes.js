const recruController = require("./recru.controller");
const express = require('express');
const bodyParser = require('body-parser');
const upload = require('../../middlewares/upload');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(bodyParser.json({ limit: '150mb' }));
router.use(bodyParser.urlencoded({ limit: '150mb', extended: true }));



// Define routes
router.post('/update', upload.fields([
    { name: 'careerImg', maxCount: 1 },
    { name: 'vision[image]' }
]), recruController.createUpdateRecru);

router.get('/list', recruController.list);
router.delete('/:id', recruController.deleteHome);

module.exports = router;
