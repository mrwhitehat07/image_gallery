const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: 'dvcudli4n',
    api_key: '187619723997438',
    api_secret: 'hjEAzY_8GzYECw6_DBD8i9nuFQ0'
});

module.exports = cloudinary;