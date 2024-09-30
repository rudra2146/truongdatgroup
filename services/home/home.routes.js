const homeController = require("./home.controller");
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the upload directory
const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');

// Create the directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Ensure the full path is created if necessary
}

// Define multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);  // Set the upload directory
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename);  // Save the file with a timestamp and its original extension
    }
});

// Initialize multer with the storage config
const upload = multer({ storage: storage });

/*
 *  Create Home (with file upload)
 */
router.post("/create", upload.single('carouselImg'), homeController.createHome);

/*
 *  List All Homes
 */
router.get("/list", homeController.listHome);

/*
 *  Get Home by ID
 */
router.get("/:id", homeController.getHome);

/*
 *  Update Home (with optional file upload)
 */
router.put("/:id", upload.single('carouselImg'), homeController.updateHome);

/*
 *  Delete Home (soft delete)
 */
router.delete("/:id", homeController.deleteHome);

module.exports = router;
