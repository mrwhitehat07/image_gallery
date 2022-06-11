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
const { protect, admin } = require("../middleware/authMiddleware")

router.get('/', getImages);
router.get('/:id', getImageById);
router.post('/', [protect, admin, upload.single('images'), addImage]);
router.get('/search/:query', searchImage)
router.put('/:id', [protect, admin, updateImage]);
router.delete('/:id', [protect, admin, deleteImage]);

module.exports = router;
