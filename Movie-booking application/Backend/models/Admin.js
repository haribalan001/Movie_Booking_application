const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required:true,
        unique: true
    },
    password: {
        type: String,
        minLength: 2,
        required: true
    },
    addedMovies: [{
        type:mongoose.Types.ObjectId,
        ref:'Movies'
    }]
});

module.exports =  mongoose.model('Admin', AdminSchema);