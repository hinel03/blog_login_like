const mongoose = require("mongoose");
const { stringify } = require("querystring");

const postsSchema = mongoose.Schema({
    
    writerId: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
    },
   
});

module.exports = mongoose.model("Posts", postsSchema);