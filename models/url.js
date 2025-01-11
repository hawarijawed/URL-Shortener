const mongoose = require("mongoose")

//Creating URL schema
const urlSchema = new mongoose.Schema({
    shortUrl:{
        type: String,
        required: true,
        unique: true,
    },

    redirectedUrl:{
        type: String,
        required: true,
    },

    visitHistory:[{timestamp:{type: Number}}],
    createdBy:{
        type: mongoose.Schema.ObjectId,
        ref: "users",
    },
},
{timestamps:true});

//Building a url model
const URL = mongoose.model("url", urlSchema);

module.exports = URL;