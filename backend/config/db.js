const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/imagegallery"

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
