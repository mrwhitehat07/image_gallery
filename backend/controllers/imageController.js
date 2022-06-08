const Image = require("../models/imageModel");
const cloudinary = require("../config/cloudinary.config");

// @post request
// api/images/
const addImage = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path)
        const image = new Image({
            title : req.body.title,
            price : req.body.price,
            description : req.body.description,
            images : req.file.images,
            category : req.body.category,
            filename : req.file.filename,
            path : result.secure_url,
            path_id: result.public_id,
        });
        const newImage = await image.save();
        res.status(201).send(newImage);
    } catch (error) {
        res.status(500).send(error);
    }
}

// @get request
// api/images/
const getImages = async (req, res) => {
    try {
        var images = await Image.find({});
        res.status(200).send(images);
    } catch (error) {
        res.status(500).send(error);
    }
}

// @get request
// api/images/:id
const getImageById = async (req, res) => {
    try {
        const image =  await Image.findById(req.params.id);
    if(image){
        res.status(200).send(image);
    } else{
        res.status(404);
        throw new Error('Image not found');
    }
    } catch (error) {
        res.status(500).send(error);
    }
}

// @put request
// api/images/:id
const updateImage = async (req, res) => {
    try {
        const { name, price, description, category, filename, path} = req.body
        const image = await Image.findById(req.params.id)
        if(image){
            image.name = name
            image.price = price
            image.description = description
            image.category = category
            // image.filename = filename
            // image.path = path 
            const updatedimage = await Image.save();
            res.status(200).json(updatedimage);
        }
        else {
            res.status(404)
            throw new Error('Product Not found');
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

// @delete method
// api/images/:id
const deleteImage = async (req, res) => {
    try {
        const image =  await Image.findById(req.params.id)
        if(image){
            await image.remove()
            res.status(204).json({message : 'image Removed'});
        } else{
            res.status(404)
            throw new Error('image not found');
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

const searchImage = async (req, res) => {
    try {
        const keyword = req.params.query ? {
            name : {
                $regex : req.params.query,
                $options : 'i'
            }
        } : {}
        const results = await Image.find({...keyword})
        console.log(keyword);
        console.log(results);
        res.json(results)
    } catch (error) {
        res.send(error)
    }
}

module.exports = {
    addImage,
    getImages,
    getImageById,
    updateImage,
    deleteImage,
    searchImage,
}