    const express = require('express');    
    const Service = require("./products.services.js");
    const multer = require("multer");
    const Product = require("./products.model.js");
    const path = require('path');
    const fs = require('fs');
    const app = express();
    const commonResponse = require('../../helper/commonResponse');
    const uploadDir = path.join(__dirname,'..', '..', 'public', 'uploads');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                console.log(`Uploading to directory: ${uploadDir}`);
                cb(null, uploadDir);
            },
            filename: (req, file, cb) => {
                const filename = Date.now() + path.extname(file.originalname);
                console.log(`Saving file as: ${filename}`);
                cb(null, filename);
            }
        });
        
    

        const upload = multer({
            storage: storage,
            fileFilter: (req, file, cb) => {
                // Add file filter logic if needed
                cb(null, true);
            }
        });


    module.exports = {
        /**
         * Add
         */
        create:[upload.single('image'),async (req, res, next) => {
            try {
                const { englishName, vietnameseName } = req.body;
                console.log(req.body);
                if (!englishName || !vietnameseName) {
                    return commonResponse.customResponse(res, "BAD_REQUEST", 400, {}, "English name and Vietnamese name are required.");
                }

        
                const image = req.file ? `uploads/${req.file.filename}` : null;
        
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

        get :  async (req, res, next) => {
            try {
                const data = await Service.get(req.params.id);
                
                if (!data) {
                    return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, "Product not found");
                }
        
                // Set default language to Vietnamese if not provided
                const languageCode = req.headers.languagecode || 'vn';
                if (!data[languageCode]) {
                    return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, `Language code ${languageCode} not available`);
                }
        
                const response = {
                    name: data[languageCode].name,
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

        list : async (req, res, next) => {
            try {
                let query = {};
                let listAll = await Service.list(query);
        
                if (!listAll) {
                    return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, "Something went wrong, Please try again");
                }
        
                // Set default language to Vietnamese
                const languageCode = req.headers.languagecode || 'vn';
                
                // Map through products to format them according to the language code
                const productsList = listAll.map(product => {
                    if (!product[languageCode]) {
                        return {
                            name: product.vn.name, // Default to Vietnamese if language code not available
                            image: product.image
                        };
                    }
        
                    return {
                        id: product._id,
                        name: product[languageCode].name,
                        image: product.image
                    };
                });
        
                return commonResponse.success(res, "PRODUCTS_GET", 200, productsList, "Success");
            } catch (error) {
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {}, error.message);
            }
        },
        
        /**
         * Update
         */
        update: [upload.single('image'), async (req, res, next) => {
            try {
                const { englishName, vietnameseName } = req.body;
                if (!englishName && !vietnameseName && !req.file) {
                    return commonResponse.customResponse(res, "BAD_REQUEST", 400, {}, "At least one field (English name, Vietnamese name, or image) is required to update.");
                }
                let updateData = {};
                
                if (englishName) updateData['en.name'] = englishName; 
                if (vietnameseName) updateData['vn.name'] = vietnameseName;
                if (req.file) updateData.image = `uploads/${req.file.filename}`; 
    
                const update = await Service.update(req.params.id, updateData);

                if (update) {
                    return commonResponse.success(res, "PRODUCTS_UPDATE", 200, update, "Product updated successfully");
                } else {
                    return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, "Something went wrong, please try again");
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
        }
    };
