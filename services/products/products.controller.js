    const Service = require("./products.services.js");
    const upload = require('../../middlewares/upload.js');
    const commonResponse = require('../../helper/commonResponse');
        module.exports = {

     manageProduct : [
    upload.array('image'),
    async (req, res, next) => {
        try {
            const { bannerTitle, title, btn, products } = req.body; // Get fields from request body
            const languageCode = req.headers['languagecode'] === 'en' ? 'en' : 'vn'; // Get language code

            console.log(req.body); // Log the request body for debugging
            console.log('Language Code:', languageCode); // Log the language code for debugging

            // Check if a product for the same user and language already exists
            const existingProduct = await Service.findByLanguageCode(languageCode);
            console.log("Fetched existing product:", existingProduct);

            // Process uploaded images
            const images = req.files ? req.files.map(file => `uploads/${file.filename}`) : [];

            // If the product exists, update it
            if (existingProduct) {
                // Update fields if provided
                if (bannerTitle) existingProduct.bannerTitle = bannerTitle;
                if (title) existingProduct.product.Title = title;
                if (btn) existingProduct.product.btn = btn;

                // If products are provided, process and update them
                if (products && Array.isArray(products)) {
                    existingProduct.product.products = products.map((product, index) => ({
                        Img: images[index] || existingProduct.product.products[index]?.Img || null, // Use existing image if none provided
                        cardTitle: product.cardTitle || existingProduct.product.products[index]?.cardTitle || "" // Use existing title if none provided
                    }));
                }

                // Update the product in the database by its _id
                const updatedProduct = await Service.update(existingProduct._id, existingProduct);
                if (updatedProduct) {
                    return commonResponse.success(
                        res,
                        "PRODUCTS_UPDATE",
                        200,
                        updatedProduct,
                        "Product updated successfully"
                    );
                } else {
                    return commonResponse.customResponse(
                        res,
                        "SERVER_ERROR",
                        500,
                        {},
                        "Something went wrong, please try again."
                    );
                }
            } else {
                // If product does not exist, create a new one
                // Validate required fields
                if (!bannerTitle || !title || !btn || !Array.isArray(products) || products.length === 0) {
                    return commonResponse.customResponse(
                        res,
                        "BAD_REQUEST",
                        400,
                        {},
                        "Banner title, title, button text, and products are required."
                    );
                }

                // Create products data
                const productsData = products.map((product, index) => ({
                    Img: images[index] || null, // Map images to the product based on index
                    cardTitle: product.cardTitle || "" // Assuming cardTitle is coming from the products array
                }));

                // Construct the product data
                const productData = {
                    userId: req.user.id, // Store the user ID
                    bannerTitle,
                    product: {
                        Title: title,
                        btn,
                        products: productsData // Store the products data here
                    },
                    language: languageCode // Add language code to the product data
                };

                // Save product data to the database
                const newProduct = await Service.add(productData);
                if (newProduct) {
                    return commonResponse.success(res, "PRODUCTS_CREATE", 200, newProduct, "Product created successfully");
                } else {
                    return commonResponse.customResponse(res, "SERVER_ERROR", 500, {}, "Something went wrong, please try again");
                }
            }
        } catch (error) {
            console.error("Error managing product:", error); // Log the error for debugging
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {}, error.message);
        }
    },
    ],       
        
        /**
         * List
         */

        list: async (req, res, next) => {
            try {
                // Get the languageCode from the request URL parameters or default to 'vn'
                const languageCode = req.headers['languagecode'] === 'en' ? 'en' : 'vn'; 
                
                // Query to find products based on the language code
                const query = { language: languageCode }; 
        
                // Fetch all products based on the query
                let listAll = await Service.list(query); // Pass the language code directly
        
                if (!listAll || listAll.length === 0) {
                    return commonResponse.customResponse(res, "NO_DATA_FOUND", 404, {}, "No products found for the specified language.");
                }
        
                // Map through products to format them according to the language code
                const productsList = listAll.map(product => {
                    // Assuming each product has a `product` property that contains Title, btn, and products
                    return {
                        bannerTitle: product.bannerTitle,
                        product: {
                            Title: product.product.Title, // Access the Title property
                            btn: product.product.btn, // Access the btn property
                            products: product.product.products.map(p => ({
                                Img: p.Img, // Image path
                                cardTitle: p.cardTitle // Product title
                            })),
                        },
                    };
                });
                    //     products: product.product.products.map(p => ({
                    //         Img: p.Img,
                    //         cardTitle: p.cardTitle,
                    //     }))
                    // };
                // });
        
                // Return the responseData
                return commonResponse.success(res, "PRODUCTS_LIST", 200, productsList, "Products retrieved successfully");
            } catch (error) {
                console.error("Error fetching products:", error); // Log the error for debugging
                return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {}, error.message);
            }
        },
    };
