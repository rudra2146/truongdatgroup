const fieldsController = require("./fields.controller");
const express = require('express');
const upload = require('../../middlewares/upload');
const router = express.Router();

// Handle large payloads
router.use(express.urlencoded({ extended: true }));
router.use(express.json({ limit: '150mb' }));
router.use(express.urlencoded({ limit: '150mb', extended: true }));

// Routes
router.post('/update', upload.fields([
    { name: 'constructionMat[image]', maxCount: 4 },
    { name: 'workImage', maxCount: 2 },
    { name: 'video', maxCount: 1 },
]), fieldsController.createUpdateFields);

router.get('/list', fieldsController.listFields);

router.get('/:id', fieldsController.getAbout);

// router.delete('/:id', fieldsController.deleteField);

module.exports = router;
