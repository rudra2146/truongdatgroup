// contact.routes.js

const express = require('express');
const contactController = require("./contact.controller");
const upload = require('../../middlewares/upload');

const router = express.Router();

router.post('/update', upload.fields([{ name: 'contactImageFile', maxCount: 1 }]), contactController.createUpdateContact);
router.get('/list', contactController.listContact);
router.get('/:id', contactController.getContactById);
router.delete('/:id', contactController.deleteContact);

module.exports = router;
