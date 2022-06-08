const express = require("express");
const upload = require("../config/multer.config");
const router = express.Router();
const { 
    getImages, 
    getImageById, 
    addImage, 
    updateImage, 
    deleteImage,
    searchImage
} = require("../controllers/imageController");

router.get('/', getImages);
router.get('/:id', getImageById);
router.post('/', [upload.single('images'), addImage]);
router.get('/search/:query', searchImage)
router.put('/:id', updateImage);
router.delete('/:id', deleteImage);

module.exports = router;
