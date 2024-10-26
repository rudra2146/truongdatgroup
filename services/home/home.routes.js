const homeController = require("./home.controller");
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

// // Create uploads directory if it doesn't exist
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Serve static files from the uploads directory
// router.use('/uploads', express.static(uploadDir));

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir); // Use the correct upload directory
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname); // Unique filename
//     }
// });

// const upload = multer({ storage: storage });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '..','..','public','uploads'); // This is where multer will save files
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const originalName = file.originalname.split('.')[0]; // Get the original name without extension
        const extension = path.extname(file.originalname); // Get the file extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate unique suffix
        // Use original name with unique suffix
        cb(null, `${originalName}-${uniqueSuffix}${extension}`);
    }
});

const upload = multer({
    storage: storage,
limits: { fileSize: 5 * 1024 * 1024 } 
});
router.post('/:languageCode', (req, res, next) => {
    console.log("Incoming Request Body:", req.body);
    console.log("Incoming Request Files:", req.files);
    next();
}, upload.fields([
    { name: 'homeAboutSection[yearImg]', maxCount: 1 },
    { name: 'homeAboutSection[img]', maxCount: 1 },
    { name: 'homeCarouselSection[carouselImg]', maxCount: 5 }
]), homeController.createHome);

router.get('/list', homeController.listHome);
router.get('/:id', homeController.getHome);
router.delete('/:id', homeController.deleteHome);

module.exports = router;
