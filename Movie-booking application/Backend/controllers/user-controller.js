const User = require('../models/User');
const bcrypt = require('bcrypt');
const Bookings = require('../models/Booking');

const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({});
    } catch (error) {
        return next(error);
    }
    if (!users) {
        return res.status(500).json({ msg: "Unexpected error occured" });
    }
    return res.status(200).json({ users });
}

const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name && name.trim() === "" &&
        !email && email.trim() === "" &&
        !password && password.trim() === "") {
        return res.status(400).json({ message: "Invalid Inputs" })
    }
    const hashedPassword = bcrypt.hashSync(password, 10); // This specifies the number of salt rounds

    let newUser;

    try {
        newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
    } catch (err) {
        return res.status(500).json({ err });
    }

    if (!newUser) {
        return res.status(500).json({ message: "Unexpected Error Occurred" });
    }

    return res.status(201).json({ id: newUser._id });
}

const getUserById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (err) {
        return res.status(500).json({ message: "Unexpected Error Occurred", error: err.message });
    }
}


const updateUser = async (req, res, next) => {
    const id = req.params.id;
    const { name, email, password } = req.body;
    if (!name && name.trim() === "" &&
        !email && email.trim() === "" &&
        !password && password.trim() === "") {
        return res.status(422).json({ message: "Invalid Inputs" })
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        const user = await User.findByIdAndUpdate(
            id,
            { name, email, password: hashedPassword },
            { new: true } // This option returns the updated user
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Updated successfully", user });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }

}

const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Deleted successfully", user });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body;
    if(!email && email.trim() === "" &&  
        !password && password.trim() === "") {
        return res.status(400).json({ message: "Invalid Inputs"})
    }

    let existingUser;

    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }

    if (!existingUser) {
        return res.status(400).json({ message: "User not found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect Password" });
    }

    return res.status(200).json({ message: "Login Successful", id: existingUser._id });
}

const getUserBooking = async (req, res, next) => {
    const id = req.params.id;
    try {
        const bookings = await Bookings.find({ user: id }).populate("user movie");

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this user" });
        }

        return res.status(200).json({ bookings });
    } catch (err) {
        return res.status(500).json({ message: "Unexpected Error Occurred", error: err.message });
    }
}



module.exports = { getAllUsers, signup,getUserById, updateUser, deleteUser, login, getUserBooking };