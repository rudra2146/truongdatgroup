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
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'uploads'; // Ensure this directory exists
        cb(null, dir); // Set destination folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use original name for the uploaded file
    }
});

// Initialize multer with the storage config
const upload = multer({ storage: storage });

// Apply multer middleware in the route for handling file uploads
router.post("/create", upload.fields([
    { name: 'yearImg', maxCount: 1 }, // Single file for yearImg
    { name: 'img', maxCount: 1 },     // Single file for img
    { name: 'carouselImg', maxCount: 10 } // Multiple files for carousel (up to 10)
]), homeController.createHome);
/*
 *  List All Homes
 */
router.get("/list", homeController.listHome);

/*
 *  Get Home by ID
 */
router.get("/get", homeController.getHome);

/*
 *  Update Home (with optional file upload)
 */
router.put('/:languageCode', upload.fields([
    { name: 'yearImg', maxCount: 1 }, // Single file for yearImg
    { name: 'img', maxCount: 1 },     // Single file for img
    { name: 'homeCarouselSection', maxCount: 10 }
]), homeController.updateHome);


/*
 *  Delete Home (soft delete)
 */
router.delete("/:id", homeController.deleteHome);

module.exports = router;
