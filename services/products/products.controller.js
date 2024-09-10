const Service = require("./products.services.js");
const multer = require("multer");
const Product = require("./products.model.js");
const commonResponse = require('./commonResponse.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


module.exports = {
    /**
     * Add
     */
    create:[upload.single('image'),async (req, res, next) => {
        try {
            const { englishName, vietnameseName } = req.body;
    
            if (!englishName || !vietnameseName) {
                return commonResponse.customResponse(res, "BAD_REQUEST", 400, {}, "English name and Vietnamese name are required.");
            }
    
            const image = req.file ? req.file.path : null;
    
            const productData = {
                image,
                en: { name: englishName },
                vn: { name: vietnameseName }
            };
    
            const data = await Service.add(productData);
    
            if (data) {
                return commonResponse.success(res, "PRODUCTS_CREATE", 200, data, "Product created successfully");
            } else {
                return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, "Something went wrong, please try again");
            }
        } catch (error) {
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {}, error.message);
        }
    }],
    

    /**
     * Get
     */

    get: async (req, res, next) => {
        try {
            const data = await Service.get(req.params.id);
    
            if (!data) {
                return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, "Product not found");
            }
    
            const languageCode = req.headers.languageCode || 'vn';
    
            let name;
            if (languageCode === 'en') {
                name = data.en.name;
            } else if (languageCode === 'vn') {
                name = data.vn.name;
            } else {
                return commonResponse.customResponse(res, "BAD_REQUEST", 400, {}, "Unsupported language code");
            }
    
            const response = {
                name: name,
                image: data.image
            };
    
            return commonResponse.success(res, "PRODUCT_GET", 200, response, "Success");
        } catch (error) {
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {}, error.message);
        }
    },
    
    
    /**
     * List
     */

    list: async (req, res, next) => {
        try {
            let query = {};
            let listAll = await Service.list(query);
            if (listAll) {
                return commonResponse.success(res, "PRODUCTS_GET", 200, listAll, "Success");
            } else {
                return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, "Something went wrong, Please try again");
            }
        } catch (error) {
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {}, error.message);
        }
    },

    /**
     * Update
     */

    update: [upload.single('image'), async (req, res, next) => {
        try {
            let update = await Service.update(req.params.id, req.body);
            if (update) {
                return commonResponse.success(res, "PRODUCTS_UPDATE", 200, update, "Success");
            } else {
                return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, "Something went wrong, Please try again");
            }
        } catch (error) {
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {}, error.message);
        }
    }],

    /**
     * delete
     */

    delete: async (req, res, next) => {
        try {
            let deleteTerms = await Service.delete(req.params.id);
            if (deleteTerms) {
                return commonResponse.success(res, "PRODUCTS_DELETE", 200, deleteTerms, "Success");
            } else {
                return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, "Something went wrong, Please try again");
            }
        } catch (error) {
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {}, error.message);
        }
    },
};