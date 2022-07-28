const mongoose = require("mongoose");
const { stringify } = require("querystring");

const commentsSchema = mongoose.Schema({
    
    writerId: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: Number,
        required: true,
    },
    
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
    },
    postId: {
        type: String,
    },
   
});

module.exports = mongoose.model("Comments", commentsSchema);