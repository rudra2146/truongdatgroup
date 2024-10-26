const Service = require("./project.services");
const commonResponse = require('../../helper/commonResponse');
const Project = require("./project.model");

module.exports = {
    createOrUpdateHome: async (req, res) => {
        try {
            const { sectionTitle, btn, Projects, languageCode } = req.body;
            const projectImages = req.files['carouselImages'] || [];
            const projectImageFile = req.files['projectImage']?.[0];

            // Check if data already exists for the given language code
            let homeData = await Service.findOne({ languageCode });

            if (homeData) {
                // Update existing data
                homeData = updateProjectData(homeData, sectionTitle, btn, Projects, projectImages, projectImageFile);
                const updatedData = await homeData.save();
                return commonResponse.success(res, "Home updated successfully", 200, updatedData, "UPDATED");
            } else {
                // Create new data
                homeData = createNewProjectData(sectionTitle, btn, Projects, projectImages, projectImageFile, languageCode);
                const savedHome = await Service.add(homeData);
                return commonResponse.success(res, "Home created successfully", 201, savedHome, "SUCCESS");
            }
        } catch (error) {
            console.error("Error saving home:", error.message || error);
            return commonResponse.error(res, "Error saving home", 500, "INTERNAL_SERVER_ERROR");
        }
    },

    get: async (req, res) => {
        try {
            const data = await Service.get(req.params.id);

            if (!data) {
                return commonResponse.customResponse(res, "Product not found", 400, {}, "SERVER_ERROR");
            }

            const languageCode = req.headers.languagecode || 'vn';
            if (!data[languageCode]) {
                return commonResponse.customResponse(res, `Language code ${languageCode} not available`, 400, {}, "SERVER_ERROR");
            }

            const response = {
                name: data[languageCode].name,
                image: data.image
            };
            return commonResponse.success(res, "PRODUCT_GET", 200, response, "Success");
        } catch (error) {
            console.error("Error fetching product:", error.message || error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {}, error.message);
        }
    },

    list: async (req, res) => {
        try {
            const languageCode = req.headers.languagecode || 'vn';
            const query = { deletedAt: null, languageCode };
            const listAll = await Project.find(query);

            if (listAll.length > 0) {
                return commonResponse.success(res, "Homes Retrieved Successfully", 200, listAll, "Success");
            } else {
                return commonResponse.customResponse(res, "No Homes Found", 404, {}, "No data available");
            }
        } catch (error) {
            console.error("Error fetching homes:", error.message || error);
            return commonResponse.error(res, "Internal Server Error", 500, error.message);
        }
    },

    delete: async (req, res) => {
        try {
            const deleteTerms = await Service.delete(req.params.id);
            if (deleteTerms) {
                return commonResponse.success(res, "PRODUCTS_DELETE", 200, deleteTerms, "Success");
            } else {
                return commonResponse.customResponse(res, "Something went wrong, Please try again", 400, {}, "SERVER_ERROR");
            }
        } catch (error) {
            console.error("Error deleting product:", error.message || error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {}, error.message);
        }
    }
};

/**
 * Helper functions to keep the controller clean
 */

const updateProjectData = (existingData, sectionTitle, btn, Projects, projectImages, projectImageFile) => {
    existingData.sectionTitle = sectionTitle || existingData.sectionTitle;
    existingData.btn = btn || existingData.btn;

    existingData.Projects = Projects.map((project, index) => {
        const existingProject = existingData.Projects[index] || {};
        return {
            image: projectImageFile ? `/uploads/${projectImageFile.filename}` : existingProject.image,
            title: project.title || existingProject.title,
            desc: project.desc || existingProject.desc,
            mainProjectDesc: project.mainProjectDesc || existingProject.mainProjectDesc,
            Invester: project.Invester || existingProject.Invester,
            Contractor: project.Contractor || existingProject.Contractor,
            Scale: project.Scale || existingProject.Scale,
            Location: project.Location || existingProject.Location,
            carousel: project.carousel.map((carouselItem, i) => ({
                mediaType: typeof carouselItem.mediaType === 'string' ? carouselItem.mediaType : existingProject.carousel[i]?.mediaType,
                url: projectImages[i]?.filename ? `/uploads/${projectImages[i].filename}` : existingProject.carousel[i]?.url
            }))
        };
    });

    return existingData;
};

const createNewProjectData = (sectionTitle, btn, Projects, projectImages, projectImageFile, languageCode) => ({
    languageCode,
    sectionTitle,
    btn,
    Projects: Projects.map((project, index) => ({
        image: projectImageFile ? `/uploads/${projectImageFile.filename}` : null,
        title: project.title,
        desc: project.desc,
        mainProjectDesc: project.mainProjectDesc,
        Invester: project.Invester,
        Contractor: project.Contractor,
        Scale: project.Scale,
        Location: project.Location,
        carousel: project.carousel.map((carouselItem, i) => ({
            mediaType: typeof carouselItem.mediaType === 'string' ? carouselItem.mediaType : 'image',
            url: projectImages[i]?.filename ? `/uploads/${projectImages[i].filename}` : null
        }))
    }))
});
