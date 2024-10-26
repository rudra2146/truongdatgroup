const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CarouselSchema = new Schema({
    mediaType: { 
        type: String, 
        required: true, 
        enum: ['image', 'video'], 
        default: 'image' 
    },
    url: { 
        type: String, 
        required: false  
    }
});

const ProjectSchema = new Schema({
    image: { type: String, required: false },  
    title: { type: String, required: true },  
    desc: { type: String, required: true },   
    mainProjectDesc: { type: String, required: false },  
    Invester: { type: String, required: false },  
    Contractor: { type: String, required: false },  
    Scale: { type: String, required: false },  
    Location: { type: String, required: false },  
    carousel: [CarouselSchema],  
});

const HomeSchema = new Schema({
    languageCode: { type: String, required: true },
    sectionTitle: { type: String, required: true },
    btn: { type: String, required: true },
    Projects: [ProjectSchema]
}, { timestamps: true });

const projectModel = mongoose.model("Project", HomeSchema);
module.exports = projectModel;
