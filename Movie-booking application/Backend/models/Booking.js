const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    movie: {
        type:mongoose.Types.ObjectId,
        ref:"Movies",
        required: true
    },
    date: {
        type: Date,  
        required: true
    },
    seatNumber: {
        type: Number,
        required: true
    },
    user: {
        type:mongoose.Types.ObjectId,
        ref:"User",
        required: true
    }
})

module.exports =  mongoose.model('Booking', BookingSchema);