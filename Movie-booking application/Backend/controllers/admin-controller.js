const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

const addAdmin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email && email.trim() === "" && !password && password.trim() === "") {
        return res.status(422).json({ message: "Invalid Inputs" });
    }

    let existingAdmin;

    try {
        existingAdmin = await Admin.findOne({ email });
    } catch (err) {
        return res.status(500).json({ message: "Unexpected Error Occurred", error: err.message });
    }

    if (existingAdmin) {
        return res.status(400).json({ message: "Admin Already Exists" });
    }

    let admin;
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        admin = new Admin({ email, password: hashedPassword });
        admin = await admin.save();
    } catch (err) {
        return res.status(500).json({ message: "Unable to create admin", error: err.message });
    }

    if (!admin) {
        return res.status(500).json({ message: "Unable to create admin" });
    }

    return res.status(201).json({ message: "Admin created", admin });
}

const adminLogin = async (req, res, next) => {
    const { email, password } = req.body;


    if (!email && email.trim() === "" &&
        !password && password.trim() === "") {
        return res.status(400).json({ message: "Invalid Inputs" });
    }

    let existingAdmin;

    try {
        existingAdmin = await Admin.findOne({ email });
    } catch (err) {
        return res.status(500).json({ message: "Unexpected Error Occurred", error: err.message });
    }

    if (!existingAdmin) {
        return res.status(401).json({ message: "Admin not found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingAdmin.password);

    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign({ id: existingAdmin._id }, process.env.SECRET_KEY, { expiresIn: '7d' });

    return res.status(200).json({ message: "Authentication Successful", token, id: existingAdmin._id });
}

const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({});

        if (!admins || admins.length === 0) {
            return res.status(404).json({ message: "No admins found" });
        }

        return res.status(200).json({ admins });
    } catch (err) {
        return res.status(500).json({ message: "Unexpected Error Occurred", error: err.message });
    }
}

const getAdminByID = async (req, res, next) => {
    const id = req.params.id;
    let admin;
    try {
        admin = await Admin.findById(id).populate("addedMovies");
    } catch (err) {
        return console.log(err);
    }
    if (!admin) {
        return console.log("Cannot find Admin");  
    }
    return res.status(200).json({ admin })
};


module.exports = {addAdmin, adminLogin, getAdmins, getAdminByID};